import { Routes } from '@angular/router';
import { Masterpage } from './paginas/masterpage/masterpage';
import { Home } from './paginas/home/home';
import { Customerpage } from './paginas/customerpage/customerpage';
import { Prospects } from './paginas/prospects/prospects';
import { Catalogpage } from './paginas/catalogpage/catalogpage';
import { Budgetpage } from './paginas/budgetpage/budgetpage';
import { Logoffpage } from './paginas/logoffpage/logoffpage';
import { Loginpage } from './paginas/loginpage/loginpage';
import { Registerpage } from './paginas/registerpage/registerpage';
import { Errorpage } from './paginas/errorpage/errorpage';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Loginpage },
  { path: 'register', component: Registerpage },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: '',
    component: Masterpage,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: Home, canActivate: [authGuard] },
      { path: 'customers', component: Customerpage, canActivate: [authGuard] },
      { path: 'prospects', component: Prospects, canActivate: [authGuard] },
      { path: 'catalog', component: Catalogpage, canActivate: [authGuard] },
      { path: 'budgets', component: Budgetpage, canActivate: [authGuard] },
      { path: 'logoff', component: Logoffpage, canActivate: [authGuard] },
    ],
  },
  { path: '**', component: Errorpage },
];
