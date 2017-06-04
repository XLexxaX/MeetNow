import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ActionSheetController} from 'ionic-angular';
import {Meeting} from '../../gen/model/Meeting'
import {PlanEvent2Page } from '../plan-event2/plan-event2';
/**
 * This class designs the event planning page.
 *
 *
 */
@IonicPage()

@Component({
  selector: 'page-plan-event',
  templateUrl: 'plan-event.html',

})
export class PlanEventPage {

  newEvent: Meeting;
  categories: Array<Meeting.CategoryEnum>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController) {

    this.newEvent = {
      ownerId: "3",
      reoccurrence: null,
      name: "",
      areas: [{}]
    };

    this.categories = [ Meeting.CategoryEnum.Jourfix, Meeting.CategoryEnum.Lunch, Meeting.CategoryEnum.Coffeebreak]
  }


   showSelectedEventLocation(eventLocation) {
    this.newEvent.areas[0] = {
      id: eventLocation
    };
  }

  checkIfValuesAreSet() {
    if (this.newEvent.name !== "" || this.newEvent.category !== null ||
      this.newEvent.areas[0].id !== "") {

    }
  }

  callingNextPage(event, item){

    this.navCtrl.push(PlanEvent2Page, {
   //   thing1: this.newEvent
     });
  }



}
