import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TurnoverComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'turnover', pathMatch: 'full' },
  { path: 'turnover', component: TurnoverComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatsRoutingModule { }
