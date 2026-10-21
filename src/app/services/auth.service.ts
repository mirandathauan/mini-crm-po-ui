import { Injectable } from '@angular/core';
import { Usuario } from '../classes/usuario';

const USUARIOS_KEY = 'minicrm_usuarios';
const SESSAO_KEY = 'minicrm_sessao';

export interface Sessao {
  nome: string;
  email: string;
  login: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public async registrar(nome: string, email: string, login: string, senha: string): Promise<void> {
    const usuarios = this.#listarUsuarios();

    if (usuarios.some((usuario) => usuario.login.toLowerCase() === login.toLowerCase())) {
      throw new Error('Já existe um usuário cadastrado com esse login');
    }

    const usuario: Usuario = {
      nome,
      email,
      login,
      senhaHash: await this.#hash(senha),
      criadoEm: new Date().toISOString(),
    };

    usuarios.push(usuario);
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
  }

  public async autenticar(login: string, senha: string): Promise<Usuario | null> {
    const senhaHash = await this.#hash(senha);

    const usuario = this.#listarUsuarios().find(
      (u) => u.login.toLowerCase() === login.toLowerCase() && u.senhaHash === senhaHash
    );

    return usuario ?? null;
  }

  public logar(usuario: Usuario): void {
    const sessao: Sessao = { nome: usuario.nome, email: usuario.email, login: usuario.login };
    localStorage.setItem(SESSAO_KEY, JSON.stringify(sessao));
  }

  public logout(): void {
    localStorage.removeItem(SESSAO_KEY);
  }

  public estaAutenticado(): boolean {
    return !!localStorage.getItem(SESSAO_KEY);
  }

  public getSessao(): Sessao | null {
    const bruto = localStorage.getItem(SESSAO_KEY);

    return bruto ? JSON.parse(bruto) : null;
  }

  #listarUsuarios(): Array<Usuario> {
    const bruto = localStorage.getItem(USUARIOS_KEY);

    return bruto ? JSON.parse(bruto) : [];
  }

  async #hash(valor: string): Promise<string> {
    const bytes = new TextEncoder().encode(valor);
    const buffer = await crypto.subtle.digest('SHA-256', bytes);

    return Array.from(new Uint8Array(buffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }
}
