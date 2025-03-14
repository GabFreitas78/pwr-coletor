import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  model,
  OnInit,
  viewChild,
} from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { getQtdProduto, patchProduto } from '../../../shared/utils';

@Component({
  selector: 'app-scan-page',
  imports: [ZXingScannerModule, MatButtonModule, MatIconModule],
  templateUrl: './scan-page.component.html',
  styleUrl: './scan-page.component.css',
})
export class ScanPageComponent implements OnInit {
  readonly allowedFormats: BarcodeFormat[] = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
  ];
  balancoId!: string;

  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  flashlightCompativel?: boolean;
  flashlightStatus = false;
  dialogOpen = false;
  camerasFound: MediaDeviceInfo[] = [];
  selectedCamera?: MediaDeviceInfo;
  alternarCameraDisponivel?: boolean;
  cameraAtualIndex?: number;

  ngOnInit(): void {
    this.balancoId = this.route.snapshot.paramMap.get('balancoId')!;
  }

  handleCamerasFound(camerasFound: MediaDeviceInfo[]) {
    this.camerasFound = camerasFound;
    if (camerasFound.length !== 2) {
      this.alternarCameraDisponivel = false;
    } else {
      this.alternarCameraDisponivel = true;
      this.cameraAtualIndex = 0;
      this.selectedCamera = camerasFound[this.cameraAtualIndex];
    }
  }

  // Alternar entre câmeras (frontal/traseira)
  alternarCamera() {
    if (this.alternarCameraDisponivel && this.cameraAtualIndex !== undefined) {
      this.cameraAtualIndex =
        (this.cameraAtualIndex + 1) % this.camerasFound.length;
      this.selectedCamera = this.camerasFound[this.cameraAtualIndex];
    }
  }

  handleScanCodigo(codigo: string) {
    if (this.dialogOpen) return;
    const dialogRef = this.dialog.open(QuantidadeDialog, {
      data: <QuantidadeDialogData>{ codigo },
    });
    this.dialogOpen = true;

    dialogRef.afterClosed().subscribe((nova_quantidade: number) => {
      if (nova_quantidade !== undefined) {
        if (nova_quantidade) patchProduto(codigo, nova_quantidade);
        this.router.navigate(['/coleta/minhas-coletas', this.balancoId]);
      }
      this.dialogOpen = false;
    });
  }
}

interface QuantidadeDialogData {
  codigo: string;
}

@Component({
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `<h2 mat-dialog-title class="!font-sans">Informar quantidade</h2>
    <mat-dialog-content class="flex flex-col gap-4">
      <p class="mb-2">Código lido: {{ data.codigo }}</p>
      <mat-form-field appearance="fill" class="w-full">
        <mat-label>Quantidade</mat-label>
        <input
          #inputQtd
          matInput
          [(ngModel)]="quantidade"
          type="number"
          [min]="0"
        />
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions class="flex justify-end gap-2">
      <button mat-button (click)="fechar()">Cancelar</button>
      <button
        mat-button
        color="primary"
        [mat-dialog-close]="quantidade()"
        [disabled]="quantidade() === 0"
      >
        Atualizar
      </button>
    </mat-dialog-actions>`,
})
class QuantidadeDialog implements OnInit {
  readonly dialogRef = inject(MatDialogRef<QuantidadeDialog>);
  readonly data = inject<QuantidadeDialogData>(MAT_DIALOG_DATA);
  readonly quantidade = model<number>(getQtdProduto(this.data.codigo));
  readonly inputQtdRef =
    viewChild.required<ElementRef<HTMLInputElement>>('inputQtd');

  ngOnInit(): void {
    this.dialogRef.afterOpened().subscribe(() => {
      const inputEl = this.inputQtdRef().nativeElement;
      inputEl.focus();
      inputEl.select();

      // Verifica se é um dispositivo mobile e simula um toque
      if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        inputEl.click();
      }
    });
  }

  fechar(): void {
    this.dialogRef.close();
  }
}
