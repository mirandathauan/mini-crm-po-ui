import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PoButtonModule, PoFieldModule, PoNotificationService } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registerpage',
  imports: [CommonModule, FormsModule, PoButtonModule, PoFieldModule],
  templateUrl: './registerpage.html',
  styleUrl: './registerpage.css',
})
export class Registerpage {
  public novoUsuario: any = {};
  public confirmarSenha: string = '';
  public isLoading = false;

  #authService = inject(AuthService);
  #notification = inject(PoNotificationService);
  #router = inject(Router);

  public async criarConta(): Promise<void> {
    const { nome, email, login, senha } = this.novoUsuario;

    if (!nome || !email || !login || !senha) {
      this.#notification.warning('Preencha todos os campos para criar sua conta');
      return;
    }

    if (senha.length < 6) {
      this.#notification.warning('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (senha !== this.confirmarSenha) {
      this.#notification.warning('As senhas informadas não coincidem');
      return;
    }

    this.isLoading = true;

    try {
      await this.#authService.registrar(nome, email, login, senha);
      this.#notification.success('Conta criada com sucesso! Faça login para continuar');
      this.#router.navigate(['/login']);
    } catch (erro: any) {
      this.#notification.error(erro?.message ?? 'Erro ao criar conta');
    } finally {
      this.isLoading = false;
    }
  }

  public voltarLogin(): void {
    this.#router.navigate(['/login']);
  }
}
