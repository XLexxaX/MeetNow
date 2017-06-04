import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlanEventPage } from './plan-event';
import {PlanEvent2Page} from "../plan-event2/plan-event2";

@NgModule({
  declarations: [
    PlanEventPage,
    PlanEvent2Page,
  ],
  imports: [
    IonicPageModule.forChild(PlanEventPage),
  ],
  exports: [
    PlanEventPage,
    PlanEvent2Page,
  ]
})
export class PlanEventPageModule {}
