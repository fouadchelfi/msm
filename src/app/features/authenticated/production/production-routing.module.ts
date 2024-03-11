import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchesGridComponent, IngredientsGridComponent } from './pages';

const routes: Routes = [
    { path: '', redirectTo: 'productions', pathMatch: 'full' },
    { path: 'batches', component: BatchesGridComponent },
    { path: 'ingredients', component: IngredientsGridComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductionRoutingModule { }