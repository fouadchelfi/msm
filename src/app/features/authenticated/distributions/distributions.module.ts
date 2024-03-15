import { NgModule } from '@angular/core';

import { DistributionsRoutingModule } from './distributions-routing.module';
import { SharedModule } from '../../../shared';
import { DistributionFormComponent, DistributionsGridComponent, PremiseFormComponent, PremisesGridComponent } from './pages';

const COMPONENTS = [PremiseFormComponent, PremisesGridComponent, DistributionFormComponent, DistributionsGridComponent]

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    DistributionsRoutingModule
  ]
})
export class DistributionsModule { }
