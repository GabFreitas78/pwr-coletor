import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-scan-page',
  imports: [ZXingScannerModule, MatButtonModule, MatIconModule],
  templateUrl: './scan-page.component.html',
  styleUrl: './scan-page.component.css',
})
export class ScanPageComponent {
  readonly allowedFormats: BarcodeFormat[] = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
  ];
  flashlightCompativel?: boolean;
  flashlightStatus = false;
  camerasFound: MediaDeviceInfo[] = [];

  handleScanCodigo(codigo: string) {
    console.log('Codigo lido com sucesso: ', codigo);
  }
}
