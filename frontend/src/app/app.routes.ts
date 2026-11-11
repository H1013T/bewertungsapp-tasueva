import type { Routes } from '@angular/router';
//Routing frontend
export const routes: Routes = [
  {
    path: 'projekte',
    loadComponent: () =>
      import('./pages/projekte-liste/projekte-liste.page').then((m) => m.ProjekteListePage),
  },
  {
    path: 'projekt-detail/:id',
    loadComponent: () =>
      import('./pages/projekt-detail/projekt-detail.page').then((m) => m.ProjektDetailPage),
  },
  {
    path: '',
    redirectTo: 'projekte',
    pathMatch: 'full',
  },
];
