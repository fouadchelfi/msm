import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'my-global-errors',
  template: `
        <div class="flex flex-col space-y-2 p-3 rounded-sm bg-red-100">
          <ng-container *ngFor="let error of errors">
            <div class="text-red-600 text-sm">* {{ error }}</div>
          </ng-container>
        </div>
    `
})
export class MyGlobalErrorComponent implements OnInit {

  @Input() errors: string[] = [];

  constructor() { }
  ngOnInit() { }
}