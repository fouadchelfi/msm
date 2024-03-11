import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'my-form-field',
    template: `
        <div class="relative flex flex-col min-h-20">
            <ng-content></ng-content>
        </div>
    `,
    encapsulation: ViewEncapsulation.None,
    styles: [`
      my-form-field { width:100%; }
    `],
})

export class MyFormFieldComponent implements OnInit {
    constructor() { }
    ngOnInit() { }
}