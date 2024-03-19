import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-settings-layout',
  template: `
        <div class="max-h-[100vh] w-[calc(100vw-165px)] overflow-hidden flex flex-col flex-1 m-6 rounded shadow-md bg-white">
          <nav mat-tab-nav-bar [tabPanel]="tabPanel">
            <a mat-tab-link routerLink="/authenticated/settings/users" routerLinkActive #rla="routerLinkActive"
              class="max-w-48" [active]="rla.isActive">Utilisateurs</a>
          </nav>
          <mat-tab-nav-panel #tabPanel>
            <router-outlet></router-outlet>
          </mat-tab-nav-panel>
        </div>
    `,
})
export class SettingsLayoutComponent implements OnInit {
  constructor() { }
  ngOnInit() { }
}