import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { HeaderComponent } from '../../components/header/header.component';

interface Conferência {
  id: string;
  nome: string;
  data: Date;
}

@Component({
  selector: 'app-conferencias',
  imports: [MatIcon, MatListModule, DatePipe, HeaderComponent],
  templateUrl: './conferencias.component.html',
  styleUrl: './conferencias.component.css'
})
export class ConferenciasComponent {
  conferencias: Conferência[] = [];

  abrirDialogNovaConferencia() {

  }

  compartilhar(conferencia: Conferência) {

  }

  deletar(conferencia: Conferência) {

  }
}
