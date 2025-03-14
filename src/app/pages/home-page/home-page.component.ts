import { Component, inject, model } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ImportarDadosDialogComponent } from '../../components/importar-dados-dialog/importar-dados-dialog.component';

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

  handleImportarDados() {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    this.dialog.open(ImportarDadosDialogComponent, {
      minHeight: '300px',
      height: '50%',
      maxHeight: '600px',
    });
  }
}
