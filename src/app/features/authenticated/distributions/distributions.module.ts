import { NgModule } from '@angular/core';

import { DistributionsRoutingModule } from './distributions-routing.module';
import { SharedModule } from '../../../shared';
import { DistributionFormComponent, DistributionsGridComponent, PremiseFormComponent, PremiseReturnFormComponent, PremiseReturnsGridComponent, PremisesGridComponent } from './pages';

const COMPONENTS = [PremiseFormComponent, PremisesGridComponent, DistributionFormComponent, DistributionsGridComponent, PremiseReturnFormComponent, PremiseReturnsGridComponent]

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    DistributionsRoutingModule
  ]
})
export class DistributionsModule { }
