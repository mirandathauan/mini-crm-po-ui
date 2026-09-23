import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoFieldModule, PoInfoModule, PoListViewModule, PoLoadingModule, PoPageModule, PoSelectOption } from "@po-ui/ng-components";
import { Customer } from '../../services/customer';

@Component({
  selector: 'app-customerpage',
  imports: [FormsModule,PoPageModule,PoListViewModule,PoInfoModule,PoLoadingModule,PoFieldModule],
  templateUrl: './customerpage.html',
  styleUrl: './customerpage.css',
})
export class Customerpage implements OnInit {
  public allCustomers: Array<Customer> = []
  public customerList: Array<Customer> = []
  public customerOptions: Array<PoSelectOption> = []
  public customerFiltro: number | null = null
  public isLoading = false
  #customerService = inject(Customer)

  ngOnInit(): void {
    this.loadData()

  }
  loadData():void{
    this.isLoading = true
    let req = this.#customerService.getCustomers()

    req.subscribe({
      next: (value:any) => {
        this.allCustomers = value.items
        this.customerList = value.items
        this.customerOptions = this.allCustomers.map((customer:any, index:number) => ({
          label: `${customer.codigo} - ${customer.nome}`,
          value: index
        }))
      },

      error: (err:any) => {
        console.log(`error req customer list`,err)
        this.isLoading = false
      },
      complete: () => {
        console.log(`complete customer list`)
        this.isLoading = false
      }
    })

  }

  filtrarCliente():void{
    this.customerList = this.customerFiltro !== null
      ? [this.allCustomers[this.customerFiltro]]
      : this.allCustomers
  }
}
