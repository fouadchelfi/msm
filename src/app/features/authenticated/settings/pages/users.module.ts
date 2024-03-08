import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../../../../shared';


@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
