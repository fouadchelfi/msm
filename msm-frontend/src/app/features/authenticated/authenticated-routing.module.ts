import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedLayoutComponent } from './authenticated-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    children: [
      { path: '', redirectTo: 'stocks', pathMatch: 'full' },
      { path: 'stocks', loadChildren: () => import('./stocks').then(m => m.StocksModule) },
      { path: 'purchases', loadChildren: () => import('./purchases').then(m => m.PurchasesModule) },
      { path: 'production', loadChildren: () => import('./production').then(m => m.ProductionModule) },
      { path: 'distributions', loadChildren: () => import('./distributions').then(m => m.DistributionsModule) },
      { path: 'sales', loadChildren: () => import('./sales').then(m => m.SalesModule) },
      { path: 'treasuries', loadChildren: () => import('./treasuries').then(m => m.TreasuriesModule) },
      { path: 'hr', loadChildren: () => import('./hr').then(m => m.HrModule) },
      { path: 'stats', loadChildren: () => import('./stats').then(m => m.StatsModule) },
      { path: 'settings', loadChildren: () => import('./settings').then(m => m.SettingsModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticatedRoutingModule { }