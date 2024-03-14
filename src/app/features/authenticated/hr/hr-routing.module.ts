import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeCreditsGridComponent, EmployeePaymentsGridComponent, EmployeesGridComponent, PunchesGridComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'punches', pathMatch: 'full' },
  { path: 'punches', component: PunchesGridComponent },
  { path: 'employees', component: EmployeesGridComponent },
  { path: 'credits', component: EmployeeCreditsGridComponent },
  { path: 'payments', component: EmployeePaymentsGridComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
