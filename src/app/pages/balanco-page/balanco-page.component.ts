import { Component, inject, OnInit } from '@angular/core';
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
import { Balanco } from '../../../shared/models';
import {
  lerBalancosDoLocalStorage,
  salvarNovoBalanco,
} from '../../../shared/utils';

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
export class BalancoPageComponent implements OnInit {
  balancos!: Balanco[];

  readonly router = inject(Router);
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.atualizarBalancos();
  }

  atualizarBalancos() {
    this.balancos = lerBalancosDoLocalStorage();
  }

  adicionarNovoBalanco() {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    const dialogRef = this.dialog.open(AddBalancoDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        salvarNovoBalanco(result);
        this.balancos = lerBalancosDoLocalStorage();
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
