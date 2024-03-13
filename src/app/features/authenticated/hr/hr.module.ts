import { NgModule } from '@angular/core';
import { HrRoutingModule } from './hr-routing.module';
import { SharedModule } from '../../../shared';
import { EmployeeFormComponent, EmployeesGridComponent, PuncheFormComponent, PunchesGridComponent } from './pages';

const COMPONENTS = [EmployeesGridComponent, EmployeeFormComponent, PuncheFormComponent, PunchesGridComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    HrRoutingModule
  ]
})
export class HrModule { }
