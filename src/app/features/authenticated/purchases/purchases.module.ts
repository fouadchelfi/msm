import { NgModule } from '@angular/core';
import { PurchasesRoutingModule } from './purchases-routing.module';
import { SharedModule } from '../../../shared';
import { SupplierFormComponent, SuppliersGridComponent } from './pages';

const COMPONENTS = [SuppliersGridComponent, SupplierFormComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    PurchasesRoutingModule
  ]
})
export class PurchasesModule { }