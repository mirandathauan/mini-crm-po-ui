# Mini CRM — Angular + PO UI + TOTVS Protheus

Mini CRM desenvolvido como projeto prático do curso **"Aprenda Angular e PO-UI do Zero"** (Klaus Wolfgram, Udemy).

O front-end é 100% Angular + [PO UI](https://po-ui.io/) e consome APIs REST escritas em TLPP, rodando em um ERP **TOTVS Protheus**. Os fontes das APIs estão na pasta [`erp-src/`](erp-src).

<!-- Dica: adicione aqui alguns prints das telas (login, dashboard, catálogo, orçamentos) -->
<!-- ![Dashboard](docs/dashboard.png) -->

## Funcionalidades

| Tela | O que faz | Origem dos dados no Protheus |
|------|-----------|------------------------------|
| **Login / Cadastro** | Cadastro de usuário e login com `po-page-login`; rotas protegidas por *guard* | Local (navegador) |
| **Dashboard** | Indicadores de orçamentos e pedidos abertos/faturados, com gráficos por status (`po-chart`, `po-widget`) | SCJ (orçamentos) e SC5 (pedidos) |
| **Clientes** | Listagem do cadastro de clientes | SA1 |
| **Prospects** | Listagem, inclusão e exclusão de prospects | SUS |
| **Catálogo** | Listagem de produtos com carrinho por cliente | SB1 + tabela customizada SZ0 (carrinho) |
| **Orçamentos** | Confirmação do carrinho gerando orçamento de venda e consulta dos orçamentos | SCJ / SCK (MATA415) |

## Tecnologias

**Front-end**
- Angular 21 (componentes *standalone*)
- PO UI 21 (`@po-ui/ng-components` e `@po-ui/ng-templates`)
- TypeScript 5.9
- Vitest para testes

**Back-end (ERP)**
- TOTVS Protheus
- APIs REST em TLPP com anotações (`@get`, `@post`, `@delete`)

## Estrutura do projeto

```
├── erp-src/              # APIs REST em TLPP (compilar no Protheus)
│   ├── curso.api.cart.tlpp
│   ├── curso.api.dashboard.tlpp
│   ├── curso.api.orcamento.tlpp
│   ├── curso.api.prospects.tlpp
│   ├── curso.api.tabelas.tlpp
│   └── curso.api.vendedor.tlpp
└── src/app/
    ├── classes/          # Modelos (Customer, Prospect, Orcamento...)
    ├── guards/           # authGuard — protege as rotas
    ├── interceptors/     # authInterceptor — headers de autenticação no ERP
    ├── paginas/          # Telas (login, dashboard, clientes, prospects, catálogo, orçamentos...)
    ├── services/         # Comunicação com as APIs REST
    └── theme/            # Tema customizado do PO UI
```

## Endpoints REST

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/curso/api/tabelas/:tabela` | Consulta genérica (SA1, SB1...) |
| GET | `/curso/api/dashboard/orcamentos` | Totais de orçamentos por status |
| GET | `/curso/api/dashboard/pedidos` | Totais de pedidos por status |
| GET | `/curso/api/prospects` | Lista prospects |
| POST | `/curso/api/prospects` | Inclui prospect |
| DELETE | `/curso/api/prospects/:chave` | Exclui prospect (`codigo\|loja`) |
| GET | `/curso/api/cart/itens/:cliente/:loja` | Itens do carrinho do cliente |
| POST | `/curso/api/cart/` | Grava itens no carrinho |
| GET | `/curso/api/cart/confirm/:cliente/:loja/:codigo` | Confirma o carrinho e gera o orçamento |
| GET | `/curso/api/orcamentos` | Lista orçamentos |
| GET | `/curso/api/vendedor/:coduser` | Dados do vendedor (SA3) |

## Como executar

### 1. Back-end (Protheus)

1. Compile os fontes da pasta `erp-src/` no seu ambiente Protheus.
2. Crie a tabela customizada **SZ0** (carrinho) no dicionário.
3. Configure e suba o serviço REST do AppServer.

### 2. Front-end

Ajuste a URL do REST em `src/environments/`:

```ts
// environment.development.ts
export const environment = {
  ambiente: 'dev',
  url: 'https://seu-servidor:porta/api'
};
```

Se necessário, ajuste usuário/senha e o `TenantId` (empresa,filial) em `src/app/interceptors/auth.interceptor.ts`.

Instale as dependências e rode:

```bash
npm install
ng serve
```

A aplicação ficará disponível em `http://localhost:4200/`.

## Observações

- Projeto de estudo: o login do front-end é feito localmente no navegador (`localStorage`, senha com hash SHA-256), sem integração com usuários do Protheus.
- As credenciais do REST no interceptor são de um ambiente de desenvolvimento e devem ser alteradas para uso real.

## Autor

**Thauan Miranda**
[LinkedIn](https://www.linkedin.com/in/thauan-miranda) · [GitHub](https://github.com/mirandathauan)

## Licença

MIT
