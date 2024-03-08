import { NgModule } from '@angular/core';
import { StocksRoutingModule } from './stocks-routing.module';
import { SharedModule } from '../../../shared';
import { CategoriesGridComponent, CategoryformComponent } from './pages';

const COMPONENTS = [CategoryformComponent, CategoriesGridComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    StocksRoutingModule
  ]
})
export class StocksModule { }
