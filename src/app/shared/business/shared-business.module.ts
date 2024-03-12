import { NgModule } from '@angular/core';
import { CalculableFieldDirective } from './directives';

const DIRECTIVES = [CalculableFieldDirective];


@NgModule({
    imports: [],
    exports: [DIRECTIVES],
    declarations: [DIRECTIVES],
})
export class SharedBusinessModule { }