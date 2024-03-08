import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-page-not-found',
    template: `
        <h1>404</h1>
        <a href="/">Home</a>
    `,
    standalone: true,
})
export class PageNotFoundComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}