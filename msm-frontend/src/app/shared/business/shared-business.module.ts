import { NgModule } from '@angular/core';
import { CalculableFieldDirective } from './directives';
import { SourceNaturePipe } from './pipes';

const DIRECTIVES = [CalculableFieldDirective];
const PIPES = [SourceNaturePipe];


@NgModule({
    imports: [],
    exports: [DIRECTIVES, PIPES],
    declarations: [DIRECTIVES, PIPES],
})
export class SharedBusinessModule { }