import { Routes } from '@angular/router';
import { BalancoPageComponent } from './pages/balanco-page/balanco-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ScanPageComponent } from './pages/scan-page/scan-page.component';

export const routes: Routes = [
    {
        path: '',
        component: HomePageComponent
    },
    {
        path: 'coleta',
        children: [
            {
                path: 'balanco',
                component: BalancoPageComponent
            },
            {
                path: 'scan/:id',
                component: ScanPageComponent
            }
        ]
    },
];
