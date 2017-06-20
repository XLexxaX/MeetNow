import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapsTestPage } from './maps-test';

@NgModule({
  declarations: [
    MapsTestPage,
  ],
  imports: [
    IonicPageModule.forChild(MapsTestPage),
  ],
  exports: [
    MapsTestPage
  ]
})
export class MapsTestPageModule {}
