import { Component, inject, OnInit } from '@angular/core';
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
  ],
  templateUrl: './coletas-page.component.html',
})
export class ColetasPageComponent implements OnInit {
  produtos!: Produto[];
  produtosFiltrados!: Produto[];
  filtro: string = '';

  readonly route = inject(ActivatedRoute);

  balancoId!: string;

  ngOnInit(): void {
    this.produtos = lerCSVDoLocalStorage();
    this.produtosFiltrados = [...this.produtos];
    this.balancoId = this.route.snapshot.paramMap.get('balancoId')!;
  }

  filtrarProdutos() {
    const termo = this.filtro.toLowerCase().trim();
    this.produtosFiltrados = this.produtos.filter(
      (p) => p.nome.toLowerCase().includes(termo) || p.codigo.includes(termo)
    );
  }
}
