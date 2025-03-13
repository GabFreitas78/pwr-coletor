import { Component } from '@angular/core';
import { DrawerComponent } from '../../components/drawer/drawer.component';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [DrawerComponent, RouterLink, MatButton],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
