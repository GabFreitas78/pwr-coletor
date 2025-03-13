import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-coleta',
  imports: [ZXingScannerModule, FormsModule, HeaderComponent],
  templateUrl: './coleta.component.html',
  styleUrl: './coleta.component.css'
})
export class ColetaComponent {
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(QuantidadeDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onCodeScanned() {
    this.openDialog();
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  template: `<div class="w-full max-w-md">
  <h2 mat-dialog-title>Produto Escaneado</h2>
  <mat-dialog-content>
    <p class="mb-2 text-center">Código: <span class="font-bold">{{ codigoLido }}</span></p>
    <mat-form-field appearance="fill" class="w-full">
      <mat-label>Informe a quantidade</mat-label>
      <input matInput type="number" [(ngModel)]="quantidade" />
    </mat-form-field>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button mat-button (click)="codigoLido = null">Cancelar</button>
    <button mat-button color="primary" (click)="salvarQuantidade()">Salvar</button>
  </mat-dialog-actions>
</div>`,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule],
})
export class QuantidadeDialog {
  quantidade: number | null = null;
  codigoLido: string | null = null;

  salvarQuantidade() {
    if (this.quantidade !== null && this.codigoLido) {
      // Adicione aqui a lógica para salvar os dados coletados.
      console.log(`Código: ${this.codigoLido}, Quantidade: ${this.quantidade}`);

      // Reseta para uma nova leitura
      this.codigoLido = null;
      this.quantidade = null;
    }
  }
}