import { Component, ElementRef, input, model, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-coleta-item',
  imports: [MatInputModule, MatButtonModule, MatIcon],
  templateUrl: './coleta-item.component.html',
})
export class ColetaItemComponent {
  readonly nome = input.required<string>();
  readonly codigo = input.required<string>();
  quantidade = model.required<number>();
  readonly unidade = input<string>('und');

  editandoQuantidade = false;
  readonly inputQtdRef =
    viewChild.required<ElementRef<HTMLInputElement>>('inputQtd');

  handleEdit() {
    this.editandoQuantidade = true;
    const inputEl = this.inputQtdRef().nativeElement;
    inputEl.readOnly = false;
    inputEl.focus();
    inputEl.select();
    // Verifica se é um dispositivo mobile e simula um toque
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      inputEl.click();
    }
  }
}
