import { NgModule } from '@angular/core';
import { SalesRoutingModule } from './sales-routing.module';
import { SharedModule } from '../../../shared';
import { CustomerFormComponent, CustomersGridComponent, SaleFormComponent, SalesGridComponent } from './pages';

const COMPONENTS = [CustomersGridComponent, CustomerFormComponent, SaleFormComponent, SalesGridComponent];


@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    SalesRoutingModule
  ]
})
export class SalesModule { }
