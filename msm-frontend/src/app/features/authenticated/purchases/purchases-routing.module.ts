import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchasesGridComponent, SuppliersGridComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'purchases', pathMatch: 'full' },
  { path: 'purchases', component: PurchasesGridComponent },
  { path: 'suppliers', component: SuppliersGridComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesRoutingModule { }
