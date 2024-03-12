import { NgModule } from '@angular/core';
import { TreasuriesRoutingModule } from './treasuries-routing.module';
import { SharedModule } from '../../../shared';
import { ChargeFormComponent, ChargeNatureFormComponent, ChargeNaturesGridComponent, ChargesGridComponent, LosseFormComponent, LosseNatureFormComponent, LosseNaturesGridComponent, LossesGridComponent, TransferFormComponent, TransfersGridComponent } from './pages';

const COMPONENTS = [
  ChargeNatureFormComponent,
  ChargeNaturesGridComponent,
  LosseNatureFormComponent,
  LosseNaturesGridComponent,
  ChargesGridComponent,
  ChargeFormComponent,
  LosseFormComponent,
  LossesGridComponent,
  TransfersGridComponent,
  TransferFormComponent,
];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    TreasuriesRoutingModule
  ]
})
export class TreasuriesModule { }