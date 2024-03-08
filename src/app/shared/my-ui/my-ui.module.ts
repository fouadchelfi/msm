import { NgModule } from '@angular/core';
import { MyInputModule } from './input';

const MODULES = [MyInputModule];

@NgModule({
    imports: [MODULES],
    exports: [MODULES],
    declarations: [],
    providers: [],
})
export class MyUiModule { }
