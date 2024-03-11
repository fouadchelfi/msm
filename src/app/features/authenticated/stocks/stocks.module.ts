import { NgModule } from '@angular/core';
import { StocksRoutingModule } from './stocks-routing.module';
import { SharedModule } from '../../../shared';
import { CategoriesGridComponent, CategoryFormComponent, FamiliesGridComponent, FamilyFormComponent, StockFormComponent, StocksGridComponent } from './pages';

const COMPONENTS = [FamilyFormComponent, FamiliesGridComponent, CategoryFormComponent, CategoriesGridComponent, StockFormComponent, StocksGridComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    StocksRoutingModule
  ]
})
export class StocksModule { }
