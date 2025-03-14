import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BalancoItemComponent } from '../../components/balanco-item/balanco-item.component';
import { FormsModule } from '@angular/forms';

interface Balanco {
  id: number;
  nome: string;
  dataCriacao: Date;
  quantidadeProdutos: number;
}

@Component({
  selector: 'app-balanco-page',
  imports: [
    HeaderComponent,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    BalancoItemComponent,
    MatTooltipModule,
  ],
  templateUrl: './balanco-page.component.html',
})
export class BalancoPageComponent {
  balancos: Balanco[] = [
    {
      id: 1,
      nome: 'Balanço Q1 2025',
      dataCriacao: new Date(2025, 0, 15),
      quantidadeProdutos: 120,
    },
    {
      id: 2,
      nome: 'Balanço Q2 2025',
      dataCriacao: new Date(2025, 3, 10),
      quantidadeProdutos: 95,
    },
    {
      id: 3,
      nome: 'Balanço de Natal',
      dataCriacao: new Date(2024, 11, 20),
      quantidadeProdutos: 200,
    },
  ];

  readonly router = inject(Router);
  readonly dialog = inject(MatDialog);

  adicionarNovoBalanco() {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    const dialogRef = this.dialog.open(AddBalancoDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        console.log(result);
      }
    });
  }
}

@Component({
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `<h2 mat-dialog-title class="!font-sans">Adicionar novo balanço</h2>
    <mat-dialog-content class="flex flex-col gap-4">
      <mat-form-field appearance="fill" class="w-full">
        <mat-label>Nome do balanço</mat-label>
        <input
          matInput
          [(ngModel)]="nomeBalanco"
          placeholder="Exemplo: Plateleira #1"
        />
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions class="flex justify-end gap-2">
      <button mat-button (click)="fechar()">Cancelar</button>
      <button
        mat-button
        color="primary"
        [mat-dialog-close]="nomeBalanco"
        [disabled]="!nomeBalanco.trim()"
      >
        Adicionar
      </button>
    </mat-dialog-actions>`,
})
class AddBalancoDialog {
  readonly dialogRef = inject(MatDialogRef<AddBalancoDialog>);
  nomeBalanco = '';

  fechar(): void {
    this.dialogRef.close();
  }
}
