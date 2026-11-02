import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoPageModule, PoWidgetModule } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth.service';

interface QuickLink {
  title: string;
  description: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-home',
  imports: [PoPageModule, PoWidgetModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  #authService = inject(AuthService);
  #router = inject(Router);

  readonly nomeUsuario = this.#authService.getSessao()?.nome ?? '';

  readonly quickLinks: Array<QuickLink> = [
    { title: 'Dashboard', description: 'Acompanhe indicadores de orçamentos e pedidos.', icon: 'an an-chart-bar', link: 'dashboard' },
    { title: 'Customers', description: 'Consulte a base de clientes cadastrados.', icon: 'an an-user', link: 'customers' },
    { title: 'Prospects', description: 'Cadastre e acompanhe novos prospects.', icon: 'an an-user-plus', link: 'prospects' },
    { title: 'Products', description: 'Navegue pelo catálogo e monte o carrinho.', icon: 'an an-grid-four', link: 'catalog' },
    { title: 'Budgets', description: 'Veja os orçamentos confirmados no ERP.', icon: 'an an-shopping-cart', link: 'budgets' },
  ];

  public irPara(link: string): void {
    this.#router.navigate([link]);
  }
}
