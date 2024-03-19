import { NgModule } from '@angular/core';
import { MyAvatarComponent } from './avatar.component';
import { CommonModule } from '@angular/common';

const COMPONENTS = [MyAvatarComponent];

@NgModule({
    imports: [CommonModule],
    exports: [COMPONENTS],
    declarations: [COMPONENTS],
})
export class MyAvatarModule { }
