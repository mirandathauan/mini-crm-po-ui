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
  public cartCodigo: string | null = null
  public isLoadingCart = false
  @ViewChild('cartModal') cartModal!: PoModalComponent
  #productService = inject(Product)
  #customerService = inject(Customer)
  #cartService = inject(Cart)
  #notification = inject(PoNotificationService)
  #proximoItemId = 1

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
    this.clienteSelecionado = valor
    this.#carregarCarrinhoCliente()
  }

  #carregarCarrinhoCliente():void{
    const cliente = this.clienteAtual

    if(!cliente){
      this.cartItems = []
      this.cartCodigo = null
      this.#proximoItemId = 1
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

        this.#proximoItemId = itens.reduce((max:number, registro:any) => Math.max(max, registro.id), 0) + 1
        this.cartCodigo = res?.codigo || null
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
    let item:any

    if(itemExistente){
      itemExistente.quantidade += quantidade
      item = itemExistente
    } else {
      item = {
        id: this.#proximoItemId++,
        codigo: product.codigo,
        nome: product.nome,
        preco: product.preco,
        quantidade: quantidade
      }
      this.cartItems.push(item)
    }

    this.#sincronizarItemERP(item, true)
  }

  #sincronizarItemERP(item:any, ativo:boolean):void{
    const cliente = this.clienteAtual
    if(!cliente){
      return
    }

    const body = {
      codCliente: cliente.codigo,
      lojCliente: cliente.loja,
      nomeCliente: cliente.nome,
      itens: [{
        id: item.id,
        ativo: ativo,
        item: {
          codigo: item.codigo,
          nome: item.nome,
          quantidade: item.quantidade,
          preco: item.preco
        }
      }],
      valor: this.cartTotalValor
    }

    this.#cartService.postCart(body).subscribe({
      next: (res:any) => {
        this.cartCodigo = res?.codigo ?? this.cartCodigo
      },
      error: (err:any) => {
        console.log(`error post cart`,err)
        this.#notification.error('Erro ao sincronizar carrinho com o ERP')
      }
    })
  }

  confirmarQuantidade(item:any):void{
    if(!item.quantidade || item.quantidade <= 0){
      item.quantidade = 1
    }
    this.#sincronizarItemERP(item, true)
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
    this.#sincronizarItemERP(item, false)
  }
}
