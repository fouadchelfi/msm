import { NgModule } from '@angular/core';

import { DistributionsRoutingModule } from './distributions-routing.module';
import { SharedModule } from '../../../shared';
import { PremiseFormComponent, PremisesGridComponent } from './pages';

const COMPONENTS = [PremiseFormComponent, PremisesGridComponent]

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    DistributionsRoutingModule
  ]
})
export class DistributionsModule { }
