import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="max-w-[100vw] max-h-[100vh] overflow-hidden">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { }
}