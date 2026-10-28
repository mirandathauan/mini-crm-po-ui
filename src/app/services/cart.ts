import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Cart {
  #http = inject(HttpClient)
  #url = environment.url

  public getCart(cliente: string, loja: string): Observable<any> {
    let url: string = `${this.#url}/curso/api/cart/itens/${cliente}/${loja}`

    return this.#http.get<any>(url)
  }

  public postCart(body: any): Observable<any> {
    let url: string = `${this.#url}/curso/api/cart/`

    return this.#http.post<any>(url, body)
  }

  public confirmCart(cliente: string, loja: string, codigo: string): Observable<any> {
    let url: string = `${this.#url}/curso/api/cart/confirm/${cliente}/${loja}/${codigo}`

    return this.#http.get<any>(url)
  }
}
