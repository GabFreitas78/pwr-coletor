import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { lerCSVDoLocalStorage } from '../../../shared/utils';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-importar-dados-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatRippleModule],
  templateUrl: './importar-dados-dialog.component.html',
})
export class ImportarDadosDialogComponent {
  readonly fileInputRef =
    viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  readonly dialogRef = inject(MatDialogRef<ImportarDadosDialogComponent>);
  readonly _snackBar = inject(MatSnackBar);
  private selectedFile = signal<File | null>(null);
  readonly selectedFilename = computed(() => this.selectedFile()?.name);
  readonly fileType = computed(() =>
    this.selectedFilename()?.split('.').pop()?.toUpperCase()
  );
  readonly fileSize = computed(() => {
    if (this.selectedFile() === null) return '';
    const sizeInBytes = this.selectedFile()!.size;
    const kb = sizeInBytes / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;

    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`;
    } else if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    } else if (kb >= 1) {
      return `${kb.toFixed(2)} KB`;
    } else {
      return `${sizeInBytes} B`;
    }
  });

  triggerFileInput() {
    this.fileInputRef().nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.selectedFile.set(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }

  onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  handleDeleteFile() {
    this.selectedFile.set(null);
    this.fileInputRef().nativeElement.value = '';
  }

  async importarDados() {
    const fileContent = await this.readFileContent(this.selectedFile()!);
    localStorage.setItem('csvData', fileContent);
    if (this.checarFormatoDados()) {
      this._snackBar.open('Dados importados com sucesso', undefined, {
        duration: 2000,
      });
      this.dialogRef.close();
    } else {
      localStorage.removeItem('csvData');
      this._snackBar.open('Formato inválido dos dados importados', undefined, {
        duration: 5000,
      });
    }
  }

  private checarFormatoDados(): boolean {
    try {
      lerCSVDoLocalStorage();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  private readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsText(file);
    });
  }

  fechar() {
    this.dialogRef.close();
  }
}
