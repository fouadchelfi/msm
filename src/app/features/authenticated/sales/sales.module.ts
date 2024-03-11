import { NgModule } from '@angular/core';
import { SalesRoutingModule } from './sales-routing.module';
import { SharedModule } from '../../../shared';
import { CustomerFormComponent, CustomersGridComponent } from './pages';

const COMPONENTS = [CustomersGridComponent, CustomerFormComponent];


@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    SalesRoutingModule
  ]
})
export class SalesModule { }
