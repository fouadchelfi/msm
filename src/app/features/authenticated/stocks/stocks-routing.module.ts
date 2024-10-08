import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesGridComponent, FamiliesGridComponent, QuantityCorrectionsGridComponent, StatusTransfersGridComponent, StocksGridComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'stocks', pathMatch: 'full' },
  { path: 'stocks', component: StocksGridComponent },
  { path: 'families', component: FamiliesGridComponent },
  { path: 'categories', component: CategoriesGridComponent },
  { path: 'quantity-corrections', component: QuantityCorrectionsGridComponent },
  { path: 'status-transfers', component: StatusTransfersGridComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StocksRoutingModule { }
