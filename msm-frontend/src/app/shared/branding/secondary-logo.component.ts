import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-secondary-logo',
    template: `
        <div class="text-3xl font-semibold"><span class="text-primary-900">#</span> KOUBA</div>
    `,
})
export class SecondaryLogoComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}