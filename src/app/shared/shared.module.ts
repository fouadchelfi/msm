import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MyUiModule } from './my-ui';
import { TextHandlerModule } from './text-handler';
import { BrandingModule } from './branding';
import { AngularMaterialModule } from './material';
import { RouterModule } from '@angular/router';

const MODULES = [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    MyUiModule,
    TextHandlerModule,
    BrandingModule,
];


const COMPONENTS = [];
const DIRECTIVES = [];
const PIPES = [];

@NgModule({
    imports: [MODULES],
    exports: [MODULES],
    declarations: [],
    providers: [],
})
export class SharedModule { }