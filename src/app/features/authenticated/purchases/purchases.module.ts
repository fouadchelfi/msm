import { NgModule } from '@angular/core';
import { PurchasesRoutingModule } from './purchases-routing.module';
import { SharedModule } from '../../../shared';
import { PurchaseFormComponent, PurchasesGridComponent, SupplierFormComponent, SuppliersGridComponent } from './pages';

const COMPONENTS = [SuppliersGridComponent, SupplierFormComponent, PurchasesGridComponent, PurchaseFormComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    PurchasesRoutingModule
  ]
})
export class PurchasesModule { }