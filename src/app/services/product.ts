import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Product {
  #http = inject(HttpClient)
  #url = environment.url

  public getProducts(): Observable<Array<Product>>{
    let url: string = `${this.#url}/curso/api/tabelas/sb1`

    return this.#http.get<Array<Product>>(url)
  }
}
