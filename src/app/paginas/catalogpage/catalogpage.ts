import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoInfoModule, PoListViewModule, PoLoadingModule, PoPageModule } from "@po-ui/ng-components";
import { Product } from '../../services/product';

@Component({
  selector: 'app-catalogpage',
  imports: [CommonModule,FormsModule,PoPageModule,PoListViewModule,PoInfoModule,PoLoadingModule,PoButtonModule,PoFieldModule],
  templateUrl: './catalogpage.html',
  styleUrl: './catalogpage.css',
})
export class Catalogpage implements OnInit {
  public productList: Array<any> = []
  public isLoading = false
  #productService = inject(Product)

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
    console.log(`item adicionado`, product.codigo, product.quantidade)
  }
}
