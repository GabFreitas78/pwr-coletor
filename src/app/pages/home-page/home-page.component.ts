import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [HeaderComponent, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

}
