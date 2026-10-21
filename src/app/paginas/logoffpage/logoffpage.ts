import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logoffpage',
  imports: [],
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
