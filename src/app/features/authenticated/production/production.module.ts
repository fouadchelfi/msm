import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { ProductionRoutingModule } from './production-routing.module';
import { IngredientFormComponent, IngredientsGridComponent, BatchFormComponent, BatchesGridComponent } from './pages';

const COMPONENTS = [
    BatchesGridComponent,
    BatchFormComponent,
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