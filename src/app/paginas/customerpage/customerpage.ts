import { Component, inject, OnInit } from '@angular/core';
import { PoInfoModule, PoListViewModule, PoLoadingModule, PoPageModule } from "@po-ui/ng-components";
import { Customer } from '../../services/customer';

@Component({
  selector: 'app-customerpage',
  imports: [PoPageModule,PoListViewModule,PoInfoModule,PoLoadingModule],
  templateUrl: './customerpage.html',
  styleUrl: './customerpage.css',
})
export class Customerpage implements OnInit {
  public customerList: Array<Customer> = []
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
        this.customerList = value.items
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
}
