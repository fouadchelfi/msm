import { NgModule } from '@angular/core';

import { AuthenticatedRoutingModule } from './authenticated-routing.module';
import { SharedModule, } from '../../shared';
import { AuthenticatedLayoutComponent } from './authenticated-layout.component';

@NgModule({
  declarations: [AuthenticatedLayoutComponent],
  imports: [
    SharedModule,
    AuthenticatedRoutingModule
  ]
})
export class AuthenticatedModule { }