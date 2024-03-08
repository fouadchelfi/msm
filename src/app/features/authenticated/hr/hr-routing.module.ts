import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebtsGridComponent, EmployeesGridComponent, PaymentsGridComponent, PunchesGridComponent } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'employees', component: EmployeesGridComponent },
  { path: 'debts', component: DebtsGridComponent },
  { path: 'payments', component: PaymentsGridComponent },
  { path: 'punches', component: PunchesGridComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
