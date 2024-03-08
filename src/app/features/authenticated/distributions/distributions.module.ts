import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistributionsRoutingModule } from './distributions-routing.module';
import { SharedModule } from '../../../shared';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    DistributionsRoutingModule
  ]
})
export class DistributionsModule { }
