import { NgModule } from '@angular/core';
import { TreasuriesRoutingModule } from './treasuries-routing.module';
import { SharedModule } from '../../../shared';
import { ChargeNatureFormComponent, ChargeNaturesGridComponent, LosseNatureFormComponent, LosseNaturesGridComponent } from './pages';

const COMPONENTS = [
  ChargeNatureFormComponent,
  ChargeNaturesGridComponent,
  LosseNatureFormComponent,
  LosseNaturesGridComponent
];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    TreasuriesRoutingModule
  ]
})
export class TreasuriesModule { }