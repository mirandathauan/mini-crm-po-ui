import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoButtonModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-errorpage',
  imports: [PoButtonModule],
  templateUrl: './errorpage.html',
  styleUrl: './errorpage.css',
})
export class Errorpage {
  #router = inject(Router);

  public voltar(): void {
    this.#router.navigate(['/home']);
  }
}
