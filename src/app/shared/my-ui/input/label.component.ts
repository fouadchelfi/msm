import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'my-label',
    template: `
        <label [for]="for">
            <ng-content></ng-content>
            <span *ngIf="required" class="font-medium text-red-600 mx-1">*</span>
        </label>
    `,
})
export class MyLabelComponent implements OnInit {

    @Input() for = "";
    @Input() required: boolean = false;

    constructor() { }
    ngOnInit() { }
}