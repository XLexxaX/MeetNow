import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlanEvent2Page } from './plan-event2';

@NgModule({
  declarations: [
    PlanEvent2Page,
  ],
  imports: [
    IonicPageModule.forChild(PlanEvent2Page),
  ],
  exports: [
    PlanEvent2Page
  ]
})
export class PlanEventPageModule {}
