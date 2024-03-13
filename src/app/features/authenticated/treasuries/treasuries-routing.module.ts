import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoneySourcesGridComponent } from './pages/money-sources-grid.component';
import { ChargeNaturesGridComponent, ChargesGridComponent, FencesGridComponent, LosseNaturesGridComponent, LossesGridComponent, MoneySourceTransfersGridComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'money-sources', pathMatch: 'full' },
  { path: 'money-sources', component: MoneySourcesGridComponent },
  { path: 'charges', component: ChargesGridComponent },
  { path: 'charge-natures', component: ChargeNaturesGridComponent },
  { path: 'losses', component: LossesGridComponent },
  { path: 'losse-natures', component: LosseNaturesGridComponent },
  { path: 'fences', component: FencesGridComponent },
  { path: 'money-source-transfers', component: MoneySourceTransfersGridComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreasuriesRoutingModule { }
