import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlanEventPage } from './plan-event';

@NgModule({
  declarations: [
    PlanEventPage,
  ],
  imports: [
    IonicPageModule.forChild(PlanEventPage),
  ],
  exports: [
    PlanEventPage
  ]
})
export class PlanEventPageModule {}
