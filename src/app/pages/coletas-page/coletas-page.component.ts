import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MatListModule } from '@angular/material/list';
import { ColetaItemComponent } from '../../components/coleta-item/coleta-item.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Produto } from '../../../shared/models';
import {
  lerBalancosDoLocalStorage,
  lerCSVDoLocalStorage,
} from '../../../shared/utils';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-coletas-page',
  imports: [
    HeaderComponent,
    MatListModule,
    ColetaItemComponent,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIcon,
    FormsModule,
    MatInputModule,
    NgxSkeletonLoaderModule,
    MatPaginatorModule, // Importação do paginator
  ],
  templateUrl: './coletas-page.component.html',
})
export class ColetasPageComponent implements OnInit, OnDestroy {
  produtos: Produto[] = []; // Todos os produtos
  produtosFiltrados: Produto[] = []; // Produtos filtrados
  produtosPaginados: Produto[] = []; // Apenas os produtos da página atual
  filtro: string = '';

  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  balancoId!: string;
  private searchSubject = new Subject<string>();
  private unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10; // Quantidade de produtos por página
  pageIndex = 0; // Página atual

  ngOnInit(): void {
    this.balancoId = this.route.snapshot.paramMap.get('balancoId')!;
    const balanco = lerBalancosDoLocalStorage().find(
      (balanco) => balanco.id === Number(this.balancoId)
    );

    if (balanco) {
      this.produtos = lerCSVDoLocalStorage().filter((produto) =>
        balanco.produtos.map((produto) => produto.id).includes(produto.id)
      );
    } else {
      this.produtos = [];
    }

    this.produtosFiltrados = [...this.produtos]; // Inicializa os filtrados
    this.atualizarPaginacao(); // Define os produtos da primeira página

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((termo) => this.filtrarProdutos(termo));
  }

  // Atualiza a lista de produtos mostrada na página atual
  atualizarPaginacao() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.produtosPaginados = this.produtosFiltrados.slice(startIndex, endIndex);
  }

  // Muda de página no paginator
  mudarPagina(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.atualizarPaginacao();
  }

  onSearchChange(event: any) {
    const value = event.target.value;
    this.searchSubject.next(value);
  }

  filtrarProdutos(termo: string) {
    const busca = termo.toLowerCase().trim();
    this.produtosFiltrados = this.produtos.filter(
      (p) => p.nome.toLowerCase().includes(busca) || p.codigo.includes(busca)
    );
    this.pageIndex = 0; // Resetar para primeira página ao filtrar
    this.atualizarPaginacao();
  }

  handleEncerrarBalanco() {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
