import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-balanco-item',
  imports: [DatePipe, MatButtonModule, RouterLink],
  templateUrl: './balanco-item.component.html',
})
export class BalancoItemComponent {
  readonly id = input.required<number>();
  readonly nome = input.required<string>();
  readonly dataCriacao = input.required<Date>();
  readonly quantidadeProdutos = input.required<number>();

  readonly router = inject(Router);

  escolherBalanco() {
    this.router.navigate(['/coleta/scan', this.id()]);
  }
}
