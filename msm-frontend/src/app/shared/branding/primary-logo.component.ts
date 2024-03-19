import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-primary-logo',
    template: `
        <div class="text-3xl font-semibold text-primary-900">KOUBA</div>
    `,
})
export class PrimaryLogoComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}