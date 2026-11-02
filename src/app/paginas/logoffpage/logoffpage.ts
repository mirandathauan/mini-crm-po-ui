import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoLoadingModule } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logoffpage',
  imports: [PoLoadingModule],
  templateUrl: './logoffpage.html',
  styleUrl: './logoffpage.css',
})
export class Logoffpage implements OnInit {
  #authService = inject(AuthService);
  #router = inject(Router);

  ngOnInit(): void {
    this.#authService.logout();
    this.#router.navigate(['/login']);
  }
}
