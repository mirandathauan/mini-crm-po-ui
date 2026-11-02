import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from "@angular/router";
import { PoThemeService } from '@po-ui/ng-components';
import { minicrmTheme } from './theme/minicrm-theme';

@Component({
  selector: 'app-root',
  imports: [CommonModule,RouterModule],
  template:`
  <router-outlet/>
  `
})
export class App {
  #themeService = inject(PoThemeService);

  constructor() {
    this.#themeService.setTheme(minicrmTheme);
  }
}
