import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ColetaComponent } from './pages/coleta/coleta.component';
import { ConferenciasComponent } from './pages/conferencias/conferencias.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'coletar',
        component: ColetaComponent
    },
    {
        path: 'conferencias',
        component: ConferenciasComponent
    },
];
