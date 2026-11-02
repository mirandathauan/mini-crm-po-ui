import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { DashboardResponse } from '../classes/dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  #http = inject(HttpClient)
  #url = environment.url

  public getOrcamentos(): Observable<DashboardResponse> {
    let url: string = `${this.#url}/curso/api/dashboard/orcamentos`

    return this.#http.get<DashboardResponse>(url)
  }

  public getPedidos(): Observable<DashboardResponse> {
    let url: string = `${this.#url}/curso/api/dashboard/pedidos`

    return this.#http.get<DashboardResponse>(url)
  }
}
