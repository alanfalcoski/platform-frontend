import { Routes } from '@angular/router';
import { AddressComponent } from './pages/address/address.component';

export const mainChildRoutes: Routes = [
  {
    path: 'usuario/endereco',
    loadComponent: () =>
      import('./pages/address/address.component').then(m => m.AddressComponent),
  },
  {
    path: 'configuracao/personalizacao',
    loadComponent: () =>
      import('./pages/configuracao/personalizacao/personalizacao.component').then(m => m.PersonalizacaoComponent),
  }
  // outras rotas filhas, tipo "configuracoes/cores" se quiser
];
