import {Component} from '@angular/core';
import {Meeting} from '../../gen/model/Meeting'
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {PlanEvent3Page} from '../plan-event3/plan-event3';

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
  reoccurrences: Array<Meeting.ReoccurrenceEnum>;
  durations: Array<number>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.newEvent = this.navParams.get('meeting');
    this.reoccurrences = [Meeting.ReoccurrenceEnum.Daily, Meeting.ReoccurrenceEnum.Weekly, Meeting.ReoccurrenceEnum.Monthly]
    this.durations = [15, 30, 60, 120];
  }

  checkIfValuesAreSet(){
    if(this.newEvent.reoccurrence !== null && this.newEvent.duration !== undefined){
      this.callingNextPage();
    }
  }

  callingNextPage() {

    this.navCtrl.push(PlanEvent3Page, {
      meeting: this.newEvent
    });
  }
}
