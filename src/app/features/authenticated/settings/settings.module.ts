import { NgModule } from '@angular/core';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '../../../shared';
import { ChangePasswordFormComponent, UserFormComponent, UsersGridComponent } from './pages';
import { SettingsLayoutComponent } from './settings-layout.component';

const COMPONENTS = [SettingsLayoutComponent, UsersGridComponent, UserFormComponent, ChangePasswordFormComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }