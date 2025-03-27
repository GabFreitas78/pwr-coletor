import { DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { deleterBalanco } from '../../../shared/utils';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-balanco-item',
  imports: [DatePipe, MatButtonModule, RouterLink, MatIconModule],
  templateUrl: './balanco-item.component.html',
})
export class BalancoItemComponent {
  readonly id = input.required<number>();
  readonly nome = input.required<string>();
  readonly dataCriacao = input.required<Date>();
  readonly quantidadeProdutos = input.required<number>();
  readonly fuiDeletado = output<void>();

  readonly router = inject(Router);

  escolherBalanco() {
    this.router.navigate(['/coleta/scan', this.id()]);
  }

  handleDeletarBalanco() {
    deleterBalanco(this.id());
    this.fuiDeletado.emit();
  }
}
