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
  contacts;
  selectedContacts;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initializeItems();
    this.newEvent = navParams.get('meeting');
    this.selectedContacts = [];
  }

  initializeItems() {
    this.contacts = [
      {name: 'Anna Huber', value: false},
      {name: 'Carlo Müller', value: false},
      {name: 'Daniel Obert', value: false},
      {name: 'Gertrude Pohl',value: false}
    ];
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.contacts = this.contacts.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  addSelectedContactToList(){
    this.selectedContacts = this.contacts.filter((item) => {
        return item.value;
    })
  }

  removeParticipant(participant){
    //TODO how to remove particpant in ionic
    console.log(participant);
  }

}


