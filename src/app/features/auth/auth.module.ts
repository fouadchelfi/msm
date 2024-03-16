import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../../shared';
import { LoginComponent } from './pages';

const COMPONENTS = [LoginComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    AuthRoutingModule,
  ]
})
export class AuthModule { }
