import { NgModule } from '@angular/core';
import { MyLabelComponent } from './label.component';
import { MyFormFieldComponent } from './form-field.component';
import { MyInputDirective } from './input.directive';
import { CommonModule } from '@angular/common';
import { MyErrorComponent } from './error.component';
import { MyTextareaDirective } from './textarea.directive';

const COMPONENTS = [MyLabelComponent, MyFormFieldComponent, MyErrorComponent];
const DIRECTIVES = [MyInputDirective, MyTextareaDirective];
const PIPES = [];

@NgModule({
    imports: [CommonModule],
    exports: [DIRECTIVES, COMPONENTS],
    declarations: [DIRECTIVES, COMPONENTS],
})
export class MyInputModule { }