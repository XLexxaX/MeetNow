import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewScheduledEventPage } from '../viewScheduledEvent/viewScheduledEvent';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedItem: any;
  plannedEvents: Array<{title: string, id: number}>;
  scheduledEvents: Array<{title: string, id: number, startTime: string, endTime: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.scheduledEvents = [];
    for (let i = 1; i <= 2; i++) {
      this.scheduledEvents.push({
        title: 'Ereignis ' + i,
        id: i,
        startTime: '10:00',
        endTime: '11:00'
      });
    }

    this.plannedEvents = [];
    for (let i = 3; i <= 5; i++) {
      this.plannedEvents.push({
        title: 'Ereignis ' + i,
        id: i
      });
    }
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ViewScheduledEventPage);
  }

}
