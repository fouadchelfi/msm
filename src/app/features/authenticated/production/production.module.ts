import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared';
import { ProductionRoutingModule } from './production-routing.module';
import { IngredientFormComponent, IngredientsGridComponent, ProductionFormComponent, ProductionsGridComponent } from './pages';

const COMPONENTS = [
    ProductionsGridComponent,
    ProductionFormComponent,
    IngredientFormComponent,
    IngredientsGridComponent,
];

@NgModule({
    declarations: [COMPONENTS],
    imports: [
        SharedModule,
        ProductionRoutingModule
    ]
})
export class ProductionModule { }