import { CommonModule } from '@angular/common';
import { Component, viewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-drawer',
  imports: [MatSidenavModule, CommonModule, MatButton],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css'
})
export class DrawerComponent {
  drawerRef = viewChild.required<MatSidenav>('drawer');
}
