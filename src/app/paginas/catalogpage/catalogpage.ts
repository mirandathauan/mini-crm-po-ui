import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoInfoModule, PoListViewModule, PoLoadingModule, PoModalComponent, PoModalModule, PoNotificationService, PoPageAction, PoPageModule, PoSelectOption } from "@po-ui/ng-components";
import { Product } from '../../services/product';
import { Customer } from '../../services/customer';

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
  public customerOptions: Array<PoSelectOption> = []
  public clienteSelecionado: number | null = null
  @ViewChild('cartModal') cartModal!: PoModalComponent
  #productService = inject(Product)
  #customerService = inject(Customer)
  #notification = inject(PoNotificationService)

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
        this.customerOptions = (value.items ?? []).map((customer:any, index:number) => ({
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
      this.cartItems.push({
        codigo: product.codigo,
        nome: product.nome,
        preco: product.preco,
        quantidade: quantidade
      })
    }
  }

  confirmarQuantidade(item:any):void{
    if(!item.quantidade || item.quantidade <= 0){
      item.quantidade = 1
    }
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
  }
}
