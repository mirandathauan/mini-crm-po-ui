import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PoMenuPanelItem, PoMenuPanelModule, PoPageModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-masterpage',
  standalone: true,
  imports: [PoMenuPanelModule, PoPageModule, RouterModule],
  templateUrl: './masterpage.html',
  styleUrl: './masterpage.css',
})
export class Masterpage {
  title = 'Home';
  readonly menus: Array<PoMenuPanelItem>=[
    {label:'Home',link:'home',action:this.clickItemMenu.bind(this),icon:'an an-house'},
    {label:'Customers',link:'customers',action:this.clickItemMenu.bind(this),icon:'an an-user'},
    {label:'Prospects',link:'prospects',action:this.clickItemMenu.bind(this),icon:'an an-user-plus'},
    {label:'Products',link:'catalog',action:this.clickItemMenu.bind(this),icon:'an an-grid-four'},
    {label:'Budgets',link:'budgets',action:this.clickItemMenu.bind(this),icon:'an an-shopping-cart'},
    {label:'Exit',link:'logoff',action:this.clickItemMenu.bind(this),icon:'an an-sign-out'}

  ]
  clickItemMenu(menu: PoMenuPanelItem):void{
    this.title = menu.label

  }
}
