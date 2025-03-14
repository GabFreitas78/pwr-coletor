import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly showBack = input<boolean>(false);
  readonly title = input<string>();
  readonly location = inject(Location);

  goBack() {
    this.location.back(); // Use the location.back() method
  }
}
