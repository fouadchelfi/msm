import { NgModule } from '@angular/core';
import { StocksRoutingModule } from './stocks-routing.module';
import { SharedModule } from '../../../shared';
import { CategoriesGridComponent, CategoryFormComponent, FamiliesGridComponent, FamilyFormComponent, QuantityCorrectionFormComponent, QuantityCorrectionsGridComponent, StatusTransferFormComponent, StatusTransfersGridComponent, StockFormComponent, StocksGridComponent } from './pages';

const COMPONENTS = [FamilyFormComponent, FamiliesGridComponent, CategoryFormComponent, CategoriesGridComponent, StockFormComponent, StocksGridComponent, QuantityCorrectionFormComponent, QuantityCorrectionsGridComponent, StatusTransferFormComponent, StatusTransfersGridComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    StocksRoutingModule
  ]
})
export class StocksModule { }
