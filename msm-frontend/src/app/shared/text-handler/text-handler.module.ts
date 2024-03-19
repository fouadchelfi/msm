import { NgModule } from '@angular/core';
import { LimitTextLengthPipe } from './limit-text-length.pipe';

const COMPONENTS = [];
const PIPES = [LimitTextLengthPipe];

@NgModule({
    imports: [],
    exports: [PIPES],
    declarations: [PIPES],
})
export class TextHandlerModule { }
