import { Component } from '@angular/core';
import { Meeting } from '../../gen/model/Meeting'
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PlanEvent3Page } from '../plan-event3/plan-event3';

/**
 * Generated class for the PlanEvent2Page page.
 *
 */
@IonicPage()
@Component({
  selector: 'page-plan-event2',
  templateUrl: 'plan-event2.html',
})
export class PlanEvent2Page {

  newEvent: Meeting;
  categories: Array<Meeting.CategoryEnum>;
  reoccurrence: Array<Meeting.ReoccurrenceEnum>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.navParams.get('thing1');


    this.newEvent = {
      ownerId: "3",
      reoccurrence: null,
      name: "",
      areas: [{}]
    };

    this.reoccurrence = [ Meeting.ReoccurrenceEnum.Daily,  Meeting.ReoccurrenceEnum.Monthly,  Meeting.ReoccurrenceEnum.Weekly]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlanEvent2Page');
  }

  setReoccurenceAnswer(reoccurenceValue) {
    alert(reoccurenceValue);
   /* this.newEvent.reoccurrence[0] = {
      id: reoccurenceValue
    };*/
  }

  setTimeFrameAnswer(timeFrameValue) {
 /*   this.newEvent.timeFrame[0] = {
      id: timeFrameValue
    };*/
 alert(timeFrameValue);
  }

  callingNextPage(event, item){

    this.navCtrl.push(PlanEvent3Page, {
      //   thing1: this.newEvent
    });
  }
}
