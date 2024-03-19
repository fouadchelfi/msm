import { NgModule } from '@angular/core';
import { PrimaryLogoComponent } from './primary-logo.component';
import { SecondaryLogoComponent } from './secondary-logo.component';

const COMPONENTS = [PrimaryLogoComponent, SecondaryLogoComponent];

@NgModule({
    imports: [],
    exports: [COMPONENTS],
    declarations: [COMPONENTS],
})
export class BrandingModule { }