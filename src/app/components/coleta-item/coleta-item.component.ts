import { Component, ElementRef, input, OnInit, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { getQtdProduto, patchProduto } from '../../../shared/utils';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
@Component({
  selector: 'app-coleta-item',
  imports: [MatInputModule, MatButtonModule, MatRippleModule, FormsModule],
  templateUrl: './coleta-item.component.html',
})
export class ColetaItemComponent implements OnInit {
  readonly balancoId = input<string>();
  readonly nome = input<string>();
  readonly codigo = input.required<string>();
  readonly unidade = input<string>();
  quantidade?: number;

  editandoQuantidade = false;
  readonly inputQtdRef =
    viewChild.required<ElementRef<HTMLInputElement>>('inputQtd');

  ngOnInit(): void {
    if (this.balancoId()) {
      this.quantidade = getQtdProduto(this.codigo(), this.balancoId()!);
    }
  }

  handleEdit() {
    if (!this.balancoId()) return;
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

  handleBlur() {
    this.editandoQuantidade = false;
    patchProduto(this.codigo(), this.quantidade!, this.balancoId()!);
    this.inputQtdRef().nativeElement.blur();
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (this.editandoQuantidade) {
        this.handleBlur();
      } else {
        this.handleEdit();
      }
    }
  }
}
