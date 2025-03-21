import { Component, inject, model } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ImportarDadosDialogComponent } from '../../components/importar-dados-dialog/importar-dados-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
      height: '80vh',
      width: '80vw',
      maxHeight: '600px',
    });
  }

  handleExportarDados() {
    const balancosData = localStorage.getItem('balancos');
    if (!balancosData) {
      this._snackBar.open('Sem dados para exportar', undefined, {
        duration: 2000,
      });
      return;
    }

    // Cria um Blob a partir da string CSV
    const blob = new Blob([balancosData], { type: 'text/json;charset=utf-8;' });

    // Gera uma URL temporária para o arquivo
    const url = window.URL.createObjectURL(blob);

    // Cria um elemento <a> para simular o download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'dados.json');

    // Anexa ao DOM, dispara o clique e remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Libera a URL temporária
    window.URL.revokeObjectURL(url);
  }
}
