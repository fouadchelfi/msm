import { NgModule } from '@angular/core';
import { MyInputModule } from './input';
import { MyErrorsModule } from './errors';

const MODULES = [MyInputModule, MyErrorsModule];

@NgModule({
    imports: [MODULES],
    exports: [MODULES],
    declarations: [],
    providers: [],
})
export class MyUiModule { }
