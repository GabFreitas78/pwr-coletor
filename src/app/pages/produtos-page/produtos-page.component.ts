import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ColetaItemComponent } from '../../components/coleta-item/coleta-item.component';
import { MatListModule } from '@angular/material/list';
import { HeaderComponent } from '../../components/header/header.component';
import { Produto } from '../../../shared/models';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { lerCSVDoLocalStorage } from '../../../shared/utils';

@Component({
  selector: 'app-produtos-page',
  imports: [
    HeaderComponent,
    MatListModule,
    ColetaItemComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIcon,
    FormsModule,
    MatInputModule,
    NgxSkeletonLoaderModule,
    MatPaginatorModule,
  ],
  templateUrl: './produtos-page.component.html',
})
export class ProdutosPageComponent {
  produtos: Produto[] = []; // Todos os produtos
  produtosFiltrados: Produto[] = []; // Produtos filtrados
  produtosPaginados: Produto[] = []; // Apenas os produtos da página atual

  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private searchSubject = new Subject<string>();
  private unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10; // Quantidade de produtos por página
  pageIndex = 0; // Página atual

  ngOnInit(): void {
    this.produtos = lerCSVDoLocalStorage();

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
      (p) => p.nome?.toLowerCase().includes(busca) || p.codigo.includes(busca)
    );
    this.pageIndex = 0; // Resetar para primeira página ao filtrar
    this.atualizarPaginacao();
  }

  handleEncerrarBalanco() {
    this.router.navigate(['/']);
  }

  removerProdutosImportados() {
    localStorage.removeItem('csvData');
    this.produtos = [];
    this.produtosPaginados = [];
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
