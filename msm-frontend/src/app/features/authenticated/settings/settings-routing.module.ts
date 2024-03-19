import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersGridComponent } from './pages/users-grid.component';
import { SettingsLayoutComponent } from './settings-layout.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsLayoutComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UsersGridComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
