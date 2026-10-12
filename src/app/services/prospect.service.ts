import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProspectService {
  #http = inject(HttpClient)
  #url = environment.url

  #headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:99'),
      'TenantId': '99,01'
    })
  }

  public getProspects(): Observable<any> {
    let url: string = `${this.#url}/curso/api/prospects`

    return this.#http.get<any>(url, { headers: this.#headers() })
  }

  public postProspect(body: any): Observable<any> {
    let url: string = `${this.#url}/curso/api/prospects`

    return this.#http.post<any>(url, body, { headers: this.#headers() })
  }

  public deleteProspect(codigo: string, loja: string): Observable<any> {
    let url: string = `${this.#url}/curso/api/prospects/${codigo}|${loja}`

    return this.#http.delete<any>(url, { headers: this.#headers() })
  }
}
