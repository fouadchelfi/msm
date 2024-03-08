import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'my-form-field',
    template: `
        <div class="relative flex flex-col">
            <ng-content></ng-content>
        </div>
    `,
})

export class MyFormFieldComponent implements OnInit {
    constructor() { }
    ngOnInit() { }
}