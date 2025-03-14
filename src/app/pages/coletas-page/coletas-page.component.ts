import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MatListModule } from '@angular/material/list';
import { ColetaItemComponent } from '../../components/coleta-item/coleta-item.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Produto } from '../../../shared/models';
import { lerCSVDoLocalStorage } from '../../../shared/utils';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
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
  ],
  templateUrl: './coletas-page.component.html',
})
export class ColetasPageComponent implements OnInit, OnDestroy {
  produtos!: Produto[];
  produtosFiltrados!: Produto[];
  filtro: string = '';

  readonly route = inject(ActivatedRoute);

  balancoId!: string;

  private searchSubject = new Subject<string>();
  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.produtos = lerCSVDoLocalStorage();
    this.produtosFiltrados = [...this.produtos];
    this.balancoId = this.route.snapshot.paramMap.get('balancoId')!;

    this.searchSubject
      .pipe(
        debounceTime(300), // Espera 300ms após a última digitação
        distinctUntilChanged(), // Evita buscas repetidas se o mesmo valor for digitado
        takeUntil(this.unsubscribe$) // Para evitar vazamentos de memória
      )
      .subscribe((termo) => this.filtrarProdutos(termo));
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
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
