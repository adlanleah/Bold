import { Routes } from '@angular/router';
import { Landing } from './CoreComps/landing/landing';
import { About } from './CoreComps/about/about';
import { Join } from './CoreComps/join/join';
import { Dashboard } from './Admin/dashboard/dashboard';
import { Login } from './Admin/login/login';
import { Wear } from './CoreComps/wear/wear';
import { Worship } from './CoreComps/worship/worship';
import { Gatherings } from './CoreComps/gatherings/gatherings';
import { Give } from './CoreComps/give/give';
import { authGuard } from './Guards/auth-guard-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./CoreComps/landing/landing').then(m => m.Landing)
  },
  {
    path: 'about',
    loadComponent: () => import('./CoreComps/about/about').then(m => m.About)
  },
  {
    path: 'join',
    loadComponent: () => import('./CoreComps/join/join').then(m => m.Join)
  },
  {
    path: 'worship',
    loadComponent: () => import('./CoreComps/worship/worship').then(m => m.Worship)
  },
  {
    path: 'wear',
    loadComponent: () => import('./CoreComps/wear/wear').then(m => m.Wear)
  },
  {
    path: 'events',
    loadComponent: () => import('./CoreComps/gatherings/gatherings').then(m => m.Gatherings)
  },
  {
    path: 'give',
    loadComponent: () => import('./CoreComps/give/give').then(m => m.Give)
  },
  {
    path: 'login',
    loadComponent: () => import('./Admin/login/login').then(m => m.Login)
  },
  {
    path: 'admin',
    loadComponent: () => import('./Admin/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];

