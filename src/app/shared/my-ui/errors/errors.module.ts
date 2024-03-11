import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MyGlobalErrorComponent } from './global-errors.component';

const COMPONENTS = [MyGlobalErrorComponent];
const DIRECTIVES = [];
const PIPES = [];

@NgModule({
    imports: [CommonModule],
    exports: [COMPONENTS],
    declarations: [COMPONENTS],
})
export class MyErrorsModule { }