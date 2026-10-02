import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoInfoModule, PoListViewModule, PoLoadingModule, PoModalComponent, PoModalModule, PoNotificationService, PoPageAction, PoPageModule, PoSelectOption } from "@po-ui/ng-components";
import { Product } from '../../services/product';
import { Customer } from '../../services/customer';
import { Cart } from '../../services/cart';

@Component({
  selector: 'app-catalogpage',
  imports: [CommonModule,FormsModule,PoPageModule,PoListViewModule,PoInfoModule,PoLoadingModule,PoButtonModule,PoFieldModule,PoModalModule],
  templateUrl: './catalogpage.html',
  styleUrl: './catalogpage.css',
})
export class Catalogpage implements OnInit {
  public productList: Array<any> = []
  public isLoading = false
  public cartItems: Array<any> = []
  public customers: Array<any> = []
  public customerOptions: Array<PoSelectOption> = []
  public clienteSelecionado: number | null = null
  public isLoadingCart = false
  public isFinalizando = false
  @ViewChild('cartModal') cartModal!: PoModalComponent
  #productService = inject(Product)
  #customerService = inject(Customer)
  #cartService = inject(Cart)
  #notification = inject(PoNotificationService)
  #rascunhos: Map<number, Array<any>> = new Map()

  get clienteAtual(): any | null {
    return this.clienteSelecionado !== null ? this.customers[this.clienteSelecionado] : null
  }

  get pageActions(): Array<PoPageAction> {
    return [
      {
        label: `Carrinho (${this.cartTotalItens})`,
        icon: 'an an-shopping-cart',
        action: this.abrirCarrinho.bind(this)
      }
    ]
  }

  get cartTotalItens(): number {
    return this.cartItems.reduce((total, item) => total + item.quantidade, 0)
  }

  get cartTotalValor(): number {
    return this.cartItems.reduce((total, item) => total + (item.quantidade * item.preco), 0)
  }

  ngOnInit(): void {
    this.loadData()
    this.loadCustomers()

  }
  loadData():void{
    this.isLoading = true
    let req = this.#productService.getProducts()

    req.subscribe({
      next: (value:any) => {
        this.productList = (value.items ?? []).map((item:any) => ({
          ...item,
          mostrarDetalhes: false,
          quantidade: null,
          quantidadeErro: ''
        }))
      },

      error: (err:any) => {
        console.log(`error req product list`,err)
        this.isLoading = false
      },
      complete: () => {
        console.log(`complete product list`)
        this.isLoading = false
      }
    })

  }

  loadCustomers():void{
    this.#customerService.getCustomers().subscribe({
      next: (value:any) => {
        this.customers = value.items ?? []
        this.customerOptions = this.customers.map((customer:any, index:number) => ({
          label: `${customer.codigo} - ${customer.nome}`,
          value: index
        }))
      },
      error: (err:any) => {
        console.log(`error req customer list`,err)
      }
    })
  }

  toggleDetalhes(product:any):void{
    product.mostrarDetalhes = !product.mostrarDetalhes
    product.quantidadeErro = ''
  }

  selecionarCliente(valor:number | null):void{
    this.#salvarRascunhoAtual()
    this.clienteSelecionado = valor
    this.#carregarCarrinhoCliente()
  }

  #salvarRascunhoAtual():void{
    if(this.clienteSelecionado !== null){
      this.#rascunhos.set(this.clienteSelecionado, this.cartItems)
    }
  }

  #carregarCarrinhoCliente():void{
    const cliente = this.clienteAtual
    const clienteIndex = this.clienteSelecionado

    if(!cliente || clienteIndex === null){
      this.cartItems = []
      return
    }

    const rascunho = this.#rascunhos.get(clienteIndex)
    if(rascunho){
      this.cartItems = rascunho
      return
    }

    this.isLoadingCart = true

    this.#cartService.getCart(cliente.codigo, cliente.loja).subscribe({
      next: (res:any) => {
        const itens = res?.itens ?? []

        this.cartItems = itens
          .filter((registro:any) => registro.ativo)
          .map((registro:any) => ({
            id: registro.id,
            codigo: registro.item.codigo,
            nome: registro.item.nome,
            preco: registro.item.preco,
            quantidade: registro.item.quantidade
          }))

        this.#rascunhos.set(clienteIndex, this.cartItems)
        this.isLoadingCart = false
      },
      error: (err:any) => {
        console.log(`error get cart`,err)
        this.#notification.error('Erro ao carregar carrinho do cliente')
        this.cartItems = []
        this.isLoadingCart = false
      }
    })
  }

  adicionarItem(product:any):void{
    if(!this.#validarClienteSelecionado()){
      return
    }

    if(!product.quantidade || product.quantidade <= 0){
      product.quantidadeErro = 'Informe uma quantidade maior que zero'
      return
    }

    product.quantidadeErro = ''
    this.#adicionarAoCarrinho(product, product.quantidade)
    product.quantidade = null
    this.abrirCarrinho()
  }

  irParaCarrinho(product:any):void{
    if(!this.#validarClienteSelecionado()){
      return
    }

    this.#adicionarAoCarrinho(product, product.quantidade && product.quantidade > 0 ? product.quantidade : 1)
    product.quantidade = null
    product.quantidadeErro = ''
    this.abrirCarrinho()
  }

  #validarClienteSelecionado():boolean{
    if(this.clienteSelecionado === null){
      this.#notification.warning('Selecione um cliente antes de adicionar itens ao carrinho')
      return false
    }
    return true
  }

  #adicionarAoCarrinho(product:any, quantidade:number):void{
    const itemExistente = this.cartItems.find(item => item.codigo === product.codigo)

    if(itemExistente){
      itemExistente.quantidade += quantidade
    } else {
      const proximoId = this.cartItems.reduce((max:number, item:any) => Math.max(max, item.id), 0) + 1
      this.cartItems.push({
        id: proximoId,
        codigo: product.codigo,
        nome: product.nome,
        preco: product.preco,
        quantidade: quantidade
      })
    }

    this.#salvarRascunhoAtual()
  }

  confirmarQuantidade(item:any):void{
    if(!item.quantidade || item.quantidade <= 0){
      item.quantidade = 1
    }
    this.#salvarRascunhoAtual()
    this.#notification.success('Quantidade atualizada')
  }

  itemSubtotal(item:any):number{
    return item.quantidade * item.preco
  }

  abrirCarrinho():void{
    this.cartModal.open()
  }

  removerItem(item:any):void{
    this.cartItems = this.cartItems.filter(cartItem => cartItem !== item)
    this.#salvarRascunhoAtual()
  }

  finalizarCompra():void{
    const cliente = this.clienteAtual

    if(!cliente){
      this.#notification.warning('Selecione um cliente antes de finalizar a compra')
      return
    }

    if(this.cartItems.length === 0){
      this.#notification.warning('Adicione itens ao carrinho antes de finalizar a compra')
      return
    }

    this.isFinalizando = true

    const body = {
      codCliente: cliente.codigo,
      lojCliente: cliente.loja,
      nomeCliente: cliente.nome,
      itens: this.cartItems.map((item:any) => ({
        id: item.id,
        ativo: true,
        item: {
          codigo: item.codigo,
          nome: item.nome,
          quantidade: item.quantidade,
          preco: item.preco
        }
      })),
      valor: this.cartTotalValor
    }

    this.#cartService.postCart(body).subscribe({
      next: (res:any) => {
        const codigoCarrinho = res?.codigo

        if(!codigoCarrinho){
          this.isFinalizando = false
          this.#notification.error('ERP não retornou o código do carrinho')
          return
        }

        this.#cartService.confirmCart(cliente.codigo, cliente.loja, codigoCarrinho).subscribe({
          next: (confirmRes:any) => {
            this.isFinalizando = false
            this.#notification.success(`Compra finalizada! Orçamento: ${confirmRes.codigo}`)
            this.cartItems = []
            this.#salvarRascunhoAtual()
            this.cartModal.close()
          },
          error: (err:any) => {
            console.log(`error confirm cart`,err)
            this.isFinalizando = false
            this.#notification.error('Erro ao confirmar a compra no ERP')
          }
        })
      },
      error: (err:any) => {
        console.log(`error post cart`,err)
        this.isFinalizando = false
        this.#notification.error('Erro ao enviar carrinho para o ERP')
      }
    })
  }
}
