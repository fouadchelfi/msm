import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesGridComponent, QuantityCorrectionsGridComponent, StatusTransfertsGridComponent, StocksGridComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'stocks', pathMatch: 'full' },
  { path: 'stocks', component: StocksGridComponent },
  { path: 'categories', component: CategoriesGridComponent },
  { path: 'quantity-corrections', component: QuantityCorrectionsGridComponent },
  { path: 'status-transferts', component: StatusTransfertsGridComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StocksRoutingModule { }
