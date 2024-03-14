import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeCreditsGridComponent, EmployeePaymentsGridComponent, EmployeesGridComponent, PunchesGridComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'employees', component: EmployeesGridComponent },
  { path: 'credits', component: EmployeeCreditsGridComponent },
  { path: 'payments', component: EmployeePaymentsGridComponent },
  { path: 'punches', component: PunchesGridComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
