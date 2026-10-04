import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Orcamentos } from '../classes/orcamento';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private http = inject(HttpClient)
  private url: string = environment.url

  private headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:99'),
      'TenantId': '99,01'
    })
  }

  public getOrcamentos() {
    return this.http.get<Orcamentos>(`${this.url}/curso/api/orcamentos`, { headers: this.headers() })
  }
}
