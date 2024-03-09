import { NgModule } from '@angular/core';
import { HrRoutingModule } from './hr-routing.module';
import { SharedModule } from '../../../shared';
import { EmployeeFormComponent, EmployeesGridComponent } from './pages';

const COMPONENTS = [EmployeesGridComponent, EmployeeFormComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    HrRoutingModule
  ]
})
export class HrModule { }
