import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
        { path: '', pathMatch: 'full', redirectTo: 'hospitals' },

        {
                path: 'login',
                loadComponent: () => import('./features/login/login').then(m => m.LoginComponent),
        },

        {
                path: 'hospitals',
                canActivate: [authGuard],
                loadComponent: () => import('./features/hospitals/hospitals').then(m => m.HospitalsComponent),
        },
        {
                path: 'hospitals/:id',
                canActivate: [authGuard],
                loadComponent: () => import('./features/hospitals/hospital-detail').then(m => m.HospitalDetailComponent),
        },

        { path: '**', redirectTo: 'hospitals' },
];
