import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DatePipe } from '@angular/common';
import { BalancoItemComponent } from '../../components/balanco-item/balanco-item.component';

interface Balanco {
  id: number;
  nome: string;
  dataCriacao: Date;
  quantidadeProdutos: number;
}

@Component({
  selector: 'app-balanco-page',
  imports: [HeaderComponent, MatButtonModule, MatIconModule, MatListModule, BalancoItemComponent],
  templateUrl: './balanco-page.component.html',
})
export class BalancoPageComponent {
  balancos: Balanco[] = [
    { id: 1, nome: 'Balanço Q1 2025', dataCriacao: new Date(2025, 0, 15), quantidadeProdutos: 120 },
    { id: 2, nome: 'Balanço Q2 2025', dataCriacao: new Date(2025, 3, 10), quantidadeProdutos: 95 },
    { id: 3, nome: 'Balanço de Natal', dataCriacao: new Date(2024, 11, 20), quantidadeProdutos: 200 },
  ];

  readonly router = inject(Router);
}
