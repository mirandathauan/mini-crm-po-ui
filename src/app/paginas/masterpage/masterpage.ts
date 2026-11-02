import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PoMenuItem, PoMenuModule, PoPageModule, PoToolbarAction, PoToolbarModule, PoToolbarProfile } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-masterpage',
  standalone: true,
  imports: [PoMenuModule, PoPageModule, PoToolbarModule, RouterModule],
  templateUrl: './masterpage.html',
  styleUrl: './masterpage.css',
})
export class Masterpage {
  #authService = inject(AuthService);
  #router = inject(Router);
  readonly nomeUsuario = this.#authService.getSessao()?.nome ?? '';
  title = 'Home';

  readonly profile: PoToolbarProfile = {
    title: this.nomeUsuario || 'Usuário',
    subtitle: this.#authService.getSessao()?.email ?? '',
  };

  readonly profileActions: Array<PoToolbarAction> = [
    { label: 'Sair', icon: 'an an-sign-out', action: () => this.#router.navigate(['/logoff']) },
  ];

  readonly menus: Array<PoMenuItem>=[
    {label:'Home',shortLabel:'Home',link:'home',action:this.clickItemMenu.bind(this),icon:'an an-house'},
    {label:'Dashboard',shortLabel:'Dashboard',link:'dashboard',action:this.clickItemMenu.bind(this),icon:'an an-chart-bar'},
    {label:'Customers',shortLabel:'Customers',link:'customers',action:this.clickItemMenu.bind(this),icon:'an an-user'},
    {label:'Prospects',shortLabel:'Prospects',link:'prospects',action:this.clickItemMenu.bind(this),icon:'an an-user-plus'},
    {label:'Products',shortLabel:'Products',link:'catalog',action:this.clickItemMenu.bind(this),icon:'an an-grid-four'},
    {label:'Budgets',shortLabel:'Budgets',link:'budgets',action:this.clickItemMenu.bind(this),icon:'an an-shopping-cart'},
    {label:'Exit',shortLabel:'Exit',link:'logoff',action:this.clickItemMenu.bind(this),icon:'an an-sign-out'}

  ]

  clickItemMenu(menu: PoMenuItem):void{
    this.title = menu.label

  }
}
