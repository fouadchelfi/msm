import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersGridComponent, SalesGridComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'sales', pathMatch: 'full' },
  { path: 'sales', component: SalesGridComponent },
  { path: 'customers', component: CustomersGridComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
