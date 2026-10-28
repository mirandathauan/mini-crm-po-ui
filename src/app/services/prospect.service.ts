import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProspectService {
  #http = inject(HttpClient)
  #url = environment.url

  public getProspects(): Observable<any> {
    let url: string = `${this.#url}/curso/api/prospects`

    return this.#http.get<any>(url)
  }

  public postProspect(body: any): Observable<any> {
    let url: string = `${this.#url}/curso/api/prospects`

    return this.#http.post<any>(url, body)
  }

  public deleteProspect(codigo: string, loja: string): Observable<any> {
    let url: string = `${this.#url}/curso/api/prospects/${codigo}|${loja}`

    return this.#http.delete<any>(url)
  }
}
