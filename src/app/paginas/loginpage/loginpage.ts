import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoPageLogin, PoPageLoginModule } from '@po-ui/ng-templates';
import { AuthService } from '../../services/auth.service';

const LOGIN_LEMBRADO_KEY = 'minicrm_login_lembrado';

@Component({
  selector: 'app-loginpage',
  imports: [PoPageLoginModule],
  templateUrl: './loginpage.html',
  styleUrl: './loginpage.css',
})
export class Loginpage {
  public isLoading = false;
  public loginErrors: Array<string> = [];
  public loginLembrado: string = localStorage.getItem(LOGIN_LEMBRADO_KEY) ?? '';

  #authService = inject(AuthService);
  #router = inject(Router);

  public async onLoginSubmit(form: PoPageLogin): Promise<void> {
    this.isLoading = true;
    this.loginErrors = [];

    const usuario = await this.#authService.autenticar(form.login, form.password);

    this.isLoading = false;

    if (!usuario) {
      this.loginErrors = ['Usuário ou senha inválidos'];
      return;
    }

    if (form.rememberUser) {
      localStorage.setItem(LOGIN_LEMBRADO_KEY, form.login);
    } else {
      localStorage.removeItem(LOGIN_LEMBRADO_KEY);
    }

    this.#authService.logar(usuario);
    this.#router.navigate(['/home']);
  }
}
