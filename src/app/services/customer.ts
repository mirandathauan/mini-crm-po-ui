import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class Customer {
  #http = inject(HttpClient)
  #url = environment.url

  public getCustomers(): Observable<Array<Customer>>{
    let url: string = `${this.#url}/curso/api/tabelas/sa1`

    return this.#http.get<Array<Customer>>(url)
  }
}
