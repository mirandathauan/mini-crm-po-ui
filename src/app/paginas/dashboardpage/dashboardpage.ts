import { Component, inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PoChartModule, PoChartSerie, PoChartType, PoDividerModule, PoInfoModule, PoLoadingModule, PoPageModule, PoWidgetModule } from '@po-ui/ng-components';
import { DashboardSerie } from '../../classes/dashboard';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboardpage',
  imports: [PoPageModule, PoWidgetModule, PoChartModule, PoDividerModule, PoInfoModule, PoLoadingModule],
  templateUrl: './dashboardpage.html',
  styleUrl: './dashboardpage.css',
})
export class Dashboardpage implements OnInit {
  public readonly chartType = PoChartType.Donut;
  public isLoading = false;
  public orcamentosSeries: Array<PoChartSerie> = [];
  public pedidosSeries: Array<PoChartSerie> = [];

  #dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.isLoading = true;

    forkJoin({
      orcamentos: this.#dashboardService.getOrcamentos(),
      pedidos: this.#dashboardService.getPedidos(),
    }).subscribe({
      next: ({ orcamentos, pedidos }) => {
        this.orcamentosSeries = this.#mapSeries(orcamentos.series);
        this.pedidosSeries = this.#mapSeries(pedidos.series);
      },
      error: (err) => console.log('erro ao carregar dados do dashboard', err),
      complete: () => this.isLoading = false,
    });
  }

  public valorSerie(label: string, series: Array<PoChartSerie>): number {
    const serie = series.find((item) => item.label === label);

    return serie ? Number(serie.data ?? 0) : 0;
  }

  #mapSeries(series: Array<DashboardSerie>): Array<PoChartSerie> {
    return (series ?? []).map((serie) => ({
      label: (serie.label ?? '').trim(),
      data: Number(serie.data?.[0] ?? 0),
    }));
  }
}
