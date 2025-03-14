import { Routes } from '@angular/router';
import { BalancoPageComponent } from './pages/balanco-page/balanco-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ScanPageComponent } from './pages/scan-page/scan-page.component';
import { ColetasPageComponent } from './pages/coletas-page/coletas-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'coleta',
    children: [
      {
        path: 'balanco',
        component: BalancoPageComponent,
      },
      {
        path: 'scan/:balancoId',
        component: ScanPageComponent,
      },
      {
        path: 'minhas-coletas/:balancoId',
        component: ColetasPageComponent,
      },
    ],
  },
];
