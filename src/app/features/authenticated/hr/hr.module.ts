import { NgModule } from '@angular/core';
import { HrRoutingModule } from './hr-routing.module';
import { SharedModule } from '../../../shared';
import { EmployeeCreditFormComponent, EmployeeCreditsGridComponent, EmployeeFormComponent, EmployeePaymentFormComponent, EmployeePaymentsGridComponent, EmployeesGridComponent, PuncheFormComponent, PunchesGridComponent } from './pages';

const COMPONENTS = [EmployeesGridComponent, EmployeeFormComponent, PuncheFormComponent, PunchesGridComponent, EmployeeCreditsGridComponent, EmployeeCreditFormComponent, EmployeePaymentsGridComponent, EmployeePaymentFormComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    HrRoutingModule
  ]
})
export class HrModule { }
