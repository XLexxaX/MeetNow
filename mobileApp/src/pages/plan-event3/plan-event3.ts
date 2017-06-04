import { Component } from '@angular/core';
import { Meeting } from '../../gen/model/Meeting'
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PlanEvent3Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-plan-event3',
  templateUrl: 'plan-event3.html',
})
export class PlanEvent3Page {

  newEvent: Meeting;
  items;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initializeItems();

    this.newEvent = {
      ownerId: "3",
      reoccurrence: null,
      name: "",
      areas: [{}]
    };
  }

  initializeItems() {
    this.items = [
      'Anna Huber',
      'Carlo Müller',
      'Daniel Obert',
      'Gertrude Pohl',
    ];
  }



}


