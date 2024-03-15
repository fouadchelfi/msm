import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-settings-layout',
    template: `
        <div class="max-h-[100vh] w-[90vw] overflow-hidden flex flex-col flex-1 m-6 rounded shadow-md bg-white">
            <nav mat-tab-nav-bar> 
                <a mat-tab-link routerLink="/authenticated/settings/users" routerLinkActive #rla="routerLinkActive" class="max-w-48" [active]="rla.isActive">Utilisateurs</a>
            </nav>
            <router-outlet></router-outlet>
        </div>
    `,
})
export class SettingsLayoutComponent implements OnInit {
    constructor() { }
    ngOnInit() { }
}