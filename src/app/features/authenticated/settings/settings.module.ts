import { NgModule } from '@angular/core';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '../../../shared';
import { UserFormComponent, UsersGridComponent } from './pages';
import { SettingsLayoutComponent } from './settings-layout.component';

const COMPONENTS = [SettingsLayoutComponent, UsersGridComponent, UserFormComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
