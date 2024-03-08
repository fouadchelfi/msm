import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DistributionsGridComponent, PremisesGridComponent, ReturnsGridComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'distributions', pathMatch: 'full' },
  { path: 'distributions', component: DistributionsGridComponent },
  { path: 'premises', component: PremisesGridComponent },
  { path: 'returns', component: ReturnsGridComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistributionsRoutingModule { }
