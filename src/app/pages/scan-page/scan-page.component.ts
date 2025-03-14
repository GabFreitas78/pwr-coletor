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
      console.log('Câmera alternada para:', this.selectedCamera);
    }
  }

  handleScanCodigo(codigo: string) {
    if (this.dialogOpen) return;
    const dialogRef = this.dialog.open(QuantidadeDialog, {
      data: <QuantidadeDialogData>{ codigo, quantidadeAnterior: 0 },
    });
    this.dialogOpen = true;

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        console.log(result);
      }
      this.dialogOpen = false;
      this.router.navigate(['/coleta/minhas-coletas', this.balancoId]);
    });
  }
}

interface QuantidadeDialogData {
  codigo: string;
  quantidadeAnterior: number;
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
  readonly quantidade = model<number>(this.data.quantidadeAnterior);
  readonly inputQtdRef =
    viewChild.required<ElementRef<HTMLInputElement>>('inputQtd');

  ngOnInit(): void {
    this.dialogRef.afterOpened().subscribe(() => {
      this.inputQtdRef().nativeElement.focus();
      this.inputQtdRef().nativeElement.select();
    });
  }

  fechar(): void {
    this.dialogRef.close();
  }
}
