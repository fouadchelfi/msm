import { NgModule } from '@angular/core';

import { StatsRoutingModule } from './stats-routing.module';
import { SharedModule } from '../../../shared';
import { TurnoverComponent } from './pages';

const COMPONENTS = [TurnoverComponent]

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    StatsRoutingModule
  ]
})
export class StatsModule { }
