import { NgModule } from '@angular/core';
import { TreasuriesRoutingModule } from './treasuries-routing.module';
import { SharedModule } from '../../../shared';
import { ChargeFormComponent, ChargeNatureFormComponent, ChargeNaturesGridComponent, ChargesGridComponent, FenceFormComponent, FencesGridComponent, LosseFormComponent, LosseNatureFormComponent, LosseNaturesGridComponent, LossesGridComponent, MoneySourceFormComponent, MoneySourceTransferFormComponent, MoneySourceTransfersGridComponent, MoneySourcesGridComponent } from './pages';

const COMPONENTS = [
  ChargeNatureFormComponent,
  ChargeNaturesGridComponent,
  LosseNatureFormComponent,
  LosseNaturesGridComponent,
  ChargesGridComponent,
  ChargeFormComponent,
  LosseFormComponent,
  LossesGridComponent,
  MoneySourceTransfersGridComponent,
  MoneySourceTransferFormComponent,
  MoneySourcesGridComponent,
  MoneySourceFormComponent,
  FenceFormComponent,
  FencesGridComponent,
];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    SharedModule,
    TreasuriesRoutingModule
  ]
})
export class TreasuriesModule { }