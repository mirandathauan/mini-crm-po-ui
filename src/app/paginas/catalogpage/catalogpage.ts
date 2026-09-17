import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoInfoModule, PoListViewModule, PoLoadingModule, PoModalComponent, PoModalModule, PoPageAction, PoPageModule, PoTableModule } from "@po-ui/ng-components";
import { Product } from '../../services/product';

@Component({
  selector: 'app-catalogpage',
  imports: [CommonModule,FormsModule,PoPageModule,PoListViewModule,PoInfoModule,PoLoadingModule,PoButtonModule,PoFieldModule,PoModalModule,PoTableModule],
  templateUrl: './catalogpage.html',
  styleUrl: './catalogpage.css',
})
export class Catalogpage implements OnInit {
  public productList: Array<any> = []
  public isLoading = false
  public cartItems: Array<any> = []
  public cartColumns: Array<any> = [
    { property: 'codigo', label: 'Codigo' },
    { property: 'nome', label: 'Nome' },
    { property: 'quantidade', label: 'Quantidade' },
    { property: 'preco', label: 'Preco', type: 'currency', format: 'BRL' },
    { property: 'acoes', label: '', type: 'icon', icons: [{ icon: 'an an-trash', action: this.removerItem.bind(this), tooltip: 'Remover' }] }
  ]
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

    const itemExistente = this.cartItems.find(item => item.codigo === product.codigo)
    if(itemExistente){
      itemExistente.quantidade += product.quantidade
    } else {
      this.cartItems.push({
        codigo: product.codigo,
        nome: product.nome,
        preco: product.preco,
        quantidade: product.quantidade
      })
    }

    product.quantidade = null
  }

  abrirCarrinho():void{
    this.cartModal.open()
  }

  removerItem(item:any):void{
    this.cartItems = this.cartItems.filter(cartItem => cartItem !== item)
  }
}
