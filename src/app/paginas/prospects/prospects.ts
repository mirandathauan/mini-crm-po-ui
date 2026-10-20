import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoInfoModule, PoListViewModule, PoLoadingModule, PoModalComponent, PoModalModule, PoNotificationService, PoPageAction, PoPageModule, PoSelectOption } from "@po-ui/ng-components";
import { Prospect } from '../../classes/prospect';
import { ProspectService } from '../../services/prospect.service';

@Component({
  selector: 'app-prospects',
  imports: [CommonModule, FormsModule, PoPageModule, PoListViewModule, PoInfoModule, PoLoadingModule, PoButtonModule, PoFieldModule, PoModalModule],
  templateUrl: './prospects.html',
  styleUrl: './prospects.css',
})
export class Prospects implements OnInit {
  public allProspects: Array<Prospect> = []
  public prospectList: Array<Prospect> = []
  public isLoading = false
  public novoProspect: any = {}
  public tipoPessoaOptions: Array<PoSelectOption> = [
    { label: 'Física', value: 'F' },
    { label: 'Jurídica', value: 'J' }
  ]
  public filtroCodigo: string = ''
  public filtroNome: string = ''
  public filtroCgc: string = ''
  public filtroTipoPessoa: string | null = null
  public sortCampo: 'codigo' | 'nome' | null = null
  public sortDirecao: 'asc' | 'desc' = 'asc'
  @ViewChild('novoProspectModal') novoProspectModal!: PoModalComponent
  #prospectService = inject(ProspectService)
  #notification = inject(PoNotificationService)

  get pageActions(): Array<PoPageAction> {
    return [
      {
        label: 'Novo Prospect',
        icon: 'an an-plus',
        action: this.abrirNovoProspecto.bind(this)
      }
    ]
  }

  ngOnInit(): void {
    this.loadData()
  }

  loadData(): void {
    this.isLoading = true

    this.#prospectService.getProspects().subscribe({
      next: (value: any) => {
        this.allProspects = value.items ?? []
        this.aplicarFiltro()
      },
      error: (err: any) => {
        console.log(`error req prospect list`, err)
        this.#notification.error('Erro ao carregar lista de prospects')
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false
      }
    })
  }

  aplicarFiltro(): void {
    const codigo = this.filtroCodigo.trim().toLowerCase()
    const nome = this.filtroNome.trim().toLowerCase()
    const cgc = this.filtroCgc.trim().toLowerCase()

    const lista = this.allProspects.filter((prospect: any) => {
      const bateCodigo = !codigo || (prospect.codigo ?? '').toLowerCase().includes(codigo)
      const bateNome = !nome || (prospect.nome ?? '').toLowerCase().includes(nome)
      const bateCgc = !cgc || (prospect.cgc ?? '').toLowerCase().includes(cgc)
      const bateTipoPessoa = !this.filtroTipoPessoa || prospect.tipopessoa === this.filtroTipoPessoa

      return bateCodigo && bateNome && bateCgc && bateTipoPessoa
    })

    this.prospectList = this.#ordenarLista(lista)
  }

  ordenarPor(campo: 'codigo' | 'nome'): void {
    if (this.sortCampo === campo) {
      this.sortDirecao = this.sortDirecao === 'asc' ? 'desc' : 'asc'
    } else {
      this.sortCampo = campo
      this.sortDirecao = 'asc'
    }

    this.aplicarFiltro()
  }

  #ordenarLista(lista: Array<Prospect>): Array<Prospect> {
    if (!this.sortCampo) {
      return lista
    }

    const campo = this.sortCampo
    const direcao = this.sortDirecao === 'asc' ? 1 : -1

    return [...lista].sort((a: any, b: any) => {
      const valorA = (a[campo] ?? '').toString().toLowerCase()
      const valorB = (b[campo] ?? '').toString().toLowerCase()

      return valorA.localeCompare(valorB) * direcao
    })
  }

  abrirNovoProspecto(): void {
    this.novoProspect = { tipopessoa: 'F' }
    this.novoProspectModal.open()
  }

  salvarProspecto(): void {
    const camposObrigatorios: Array<{ chave: string, label: string }> = [
      { chave: 'tipopessoa', label: 'Tipo Pessoa' },
      { chave: 'cgc', label: 'CPF/CNPJ' },
      { chave: 'nome', label: 'Nome' },
      { chave: 'contato', label: 'Contato' },
      { chave: 'endereco', label: 'Endereço' },
      { chave: 'email', label: 'Email' },
      { chave: 'homepage', label: 'Home Page' },
      { chave: 'ddd', label: 'DDD' },
      { chave: 'telefone', label: 'Telefone' }
    ]

    const campoFaltante = camposObrigatorios.find((campo) => !this.novoProspect[campo.chave])

    if (campoFaltante) {
      this.#notification.warning(`Informe o campo ${campoFaltante.label}`)
      return
    }

    this.#prospectService.postProspect(this.novoProspect).subscribe({
      next: (res: any) => {
        this.#notification.success(res?.status ?? 'Prospect cadastrado com sucesso')
        this.novoProspectModal.close()
        this.loadData()
      },
      error: (err: any) => {
        console.log(`error post prospect`, err)
        this.#notification.error('Erro ao cadastrar prospect')
      }
    })
  }

  removerProspecto(prospect: Prospect): void {
    this.#prospectService.deleteProspect(prospect.codigo, prospect.loja).subscribe({
      next: () => {
        this.#notification.success('Prospect removido com sucesso')
        this.loadData()
      },
      error: (err: any) => {
        console.log(`error delete prospect`, err)
        this.#notification.error('Erro ao remover prospect')
      }
    })
  }
}
