import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MatListModule } from '@angular/material/list';
import { ColetaItemComponent } from '../../components/coleta-item/coleta-item.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

interface Produto {
  id: number;
  nome: string;
  quantidade: number;
  unidade: string;
  codigo: string;
}

@Component({
  selector: 'app-coletas-page',
  imports: [
    HeaderComponent,
    MatListModule,
    ColetaItemComponent,
    RouterLink,
    MatButtonModule,
  ],
  templateUrl: './coletas-page.component.html',
})
export class ColetasPageComponent implements OnInit {
  produtos: Produto[] = [
    {
      id: 1,
      nome: 'Tomate',
      quantidade: 123,
      unidade: 'KG',
      codigo: '123321123',
    },
    {
      id: 2,
      nome: 'Livro',
      quantidade: 123,
      unidade: 'UNDS',
      codigo: '123321342123',
    },
    {
      id: 3,
      nome: 'Cigarro',
      quantidade: 123,
      unidade: 'MC',
      codigo: '12312321123',
    },
  ];

  readonly route = inject(ActivatedRoute);

  balancoId!: string;

  ngOnInit(): void {
    this.balancoId = this.route.snapshot.paramMap.get('balancoId')!;
  }
}
