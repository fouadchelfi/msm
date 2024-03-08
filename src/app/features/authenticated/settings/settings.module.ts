import { NgModule } from '@angular/core';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '../../../shared';
import { UserFormComponent, UsersGridComponent } from './pages';

const COMPONENTS = [UsersGridComponent, UserFormComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
