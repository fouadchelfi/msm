import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatsComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'stats', pathMatch: 'full' },
  { path: 'stats', component: StatsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatsRoutingModule { }
