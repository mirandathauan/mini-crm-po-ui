import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoInfoModule, PoListViewModule, PoLoadingModule, PoModalComponent, PoModalModule, PoPageAction, PoPageModule } from "@po-ui/ng-components";
import { Product } from '../../services/product';

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
  @ViewChild('cartModal') cartModal!: PoModalComponent
  #productService = inject(Product)

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

  toggleDetalhes(product:any):void{
    product.mostrarDetalhes = !product.mostrarDetalhes
    product.quantidadeErro = ''
  }

  adicionarItem(product:any):void{
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
    this.#adicionarAoCarrinho(product, product.quantidade && product.quantidade > 0 ? product.quantidade : 1)
    product.quantidade = null
    product.quantidadeErro = ''
    this.abrirCarrinho()
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

  atualizarQuantidade(item:any):void{
    if(!item.quantidade || item.quantidade <= 0){
      item.quantidade = 1
    }
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
