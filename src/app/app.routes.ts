import { Routes } from '@angular/router';
import { Masterpage } from './paginas/masterpage/masterpage';
import { Home } from './paginas/home/home';
import { Customerpage } from './paginas/customerpage/customerpage';
import { Prospects } from './paginas/prospects/prospects';
import { Catalogpage } from './paginas/catalogpage/catalogpage';
import { Budgetpage } from './paginas/budgetpage/budgetpage';
import { Logoffpage } from './paginas/logoffpage/logoffpage';
import { Loginpage } from './paginas/loginpage/loginpage';
import { Errorpage } from './paginas/errorpage/errorpage';

export const routes: Routes = [
  { path: 'login', component: Loginpage },
  {
    path: '',
    component: Masterpage,
    children: [
      { path: 'home', component: Home },
      { path: 'customers', component: Customerpage },
      { path: 'prospects', component: Prospects },
      { path: 'catalog', component: Catalogpage },
      { path: 'budgets', component: Budgetpage },
      { path: 'logoff', component: Logoffpage },
    ],
  },
  { path: '**', component: Errorpage },
];
