import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ImportarDadosDialogComponent } from '../../components/importar-dados-dialog/importar-dados-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { lerBalancosDoLocalStorage } from '../../../shared/utils';
import { Balanco } from '../../../shared/models';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-home-page',
  imports: [
    HeaderComponent,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatIconModule,
  ],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  readonly dialog = inject(MatDialog);
  readonly _snackBar = inject(MatSnackBar);

  handleImportarDados() {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    this.dialog.open(ImportarDadosDialogComponent, {
      minHeight: '300px',
      height: '70vh',
      width: '80vw',
      maxHeight: '600px',
    });
  }

  handleExportarDados() {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    this.dialog.open(ExportarDadosDialogComponent, {
      minHeight: '300px',
      height: '40vh',
      width: '80vw',
      maxHeight: '600px',
    });
  }
}

@Component({
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
  ],
  template: `<h2 mat-dialog-title class="!font-sans !font-semibold">
      Exportar dados
    </h2>
    <mat-dialog-content class="!flex !flex-col">
      <p class="text-md mb-4">
        Escolha um balanço para exportar. O formato de exportação do balanço é
        um arquivo .csv com o id do produto e sua respectiva quantidade.
      </p>
      <mat-form-field>
        <mat-label>Escolha um balanço:</mat-label>
        <mat-select [(value)]="balancoEscolhido">
          @for (balanco of balancos; track balanco.id) {
          <mat-option [value]="balanco">{{ balanco.nome }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions class="upload-actions">
      <button mat-button (click)="fechar()">Cancelar</button>
      <button
        mat-button
        color="primary"
        (click)="exportarDados()"
        [disabled]="!balancoEscolhido"
      >
        Exportar
      </button>
    </mat-dialog-actions> `,
})
class ExportarDadosDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ExportarDadosDialogComponent>);
  readonly _snackBar = inject(MatSnackBar);
  readonly balancos = lerBalancosDoLocalStorage();
  balancoEscolhido: Balanco | null = null;

  exportarDados() {
    if (!this.balancoEscolhido) {
      this._snackBar.open('Sem balanço para exportar', undefined, {
        duration: 2000,
      });
      return;
    }

    const rows = this.balancoEscolhido.produtos.map((produto) => [
      produto.id,
      produto.quantidade,
    ]);

    // Gera a string CSV utilizando ; como delimitador
    const csvString = Papa.unparse(rows, {
      delimiter: ';', // separador desejado
      header: false, // não queremos nomes de coluna
    });

    // Cria um Blob a partir da string CSV
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    // Gera uma URL temporária para o arquivo
    const url = window.URL.createObjectURL(blob);

    // Cria um elemento <a> para simular o download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'dados.csv');

    // Anexa ao DOM, dispara o clique e remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Libera a URL temporária
    window.URL.revokeObjectURL(url);
  }

  fechar() {
    this.dialogRef.close();
  }
}
