import { NgModule } from '@angular/core';
import { MyInputModule } from './input';
import { MyErrorsModule } from './errors';
import { MyAvatarModule } from './avatar';

const MODULES = [MyInputModule, MyErrorsModule, MyAvatarModule];

@NgModule({
    imports: [MODULES],
    exports: [MODULES],
})
export class MyUiModule { }