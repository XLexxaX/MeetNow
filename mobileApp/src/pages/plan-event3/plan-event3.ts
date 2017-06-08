import {Component} from '@angular/core';
import {Meeting} from '../../gen/model/Meeting'
import {IonicPage, NavController, NavParams} from 'ionic-angular';

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
  initialContacts;
  contacts;
  selectedContacts;
  meetingSaveable: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initializeContacts();
    this.resetSearchResults();
    this.newEvent = navParams.get('meeting');
    this.selectedContacts = [];
    this.meetingSaveable = false;
  }

  initializeContacts(){

  }

  resetSearchResults() {
    this.contacts = [
      {name: 'Anna Huber', value: false},
      {name: 'Carlo Müller', value: false},
      {name: 'Daniel Obert', value: false},
      {name: 'Gertrude Pohl', value: false}
    ];
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.resetSearchResults();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.contacts = this.contacts.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  addSelectedContactsToList() {
    this.selectedContacts = this.contacts.filter((item) => {
      return item.value;
    })
    this.meetingSaveable = this.selectedContacts.length > 0;
  }

  removeParticipant($event) {
    let button = $event.target;
    let text = button.innerText.trim();
    this.contacts.filter((item) => {
      return (text.toLowerCase().indexOf(item.name.toLowerCase()) > -1);
    }).forEach((item) => {
      item.value = false;
    })
    this.addSelectedContactsToList();
  }

  saveMeeting(){
    //TODO: do something with this.newEvent and navigate to meeting overview page
  }

}


