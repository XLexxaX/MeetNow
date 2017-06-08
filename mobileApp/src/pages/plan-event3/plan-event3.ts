import {Component} from '@angular/core';
import {Meeting} from '../../gen/model/Meeting'
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Contacts, Contact, ContactField, ContactName} from '@ionic-native/contacts';

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
  providers: [Contacts]
})
export class PlanEvent3Page {

  newEvent: Meeting;
  allContacts;
  searchQuery: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private contacts: Contacts) {
    this.newEvent = navParams.get('meeting');
    this.initializeContacts();
  }

  initializeContacts() {
    this.allContacts = [
      {name: 'Anna Huber', value: false},
      {name: 'Carlo Müller', value: false},
      {name: 'Daniel Obert', value: false},
      {name: 'Gertrude Pohl', value: false}
    ];
    this.contacts.find(['name']).then(
      (allContacts: Contact[]) => {
        console.log(allContacts);
        allContacts.forEach((contact) => {
          //TODO push contacts in page format into this.allContacts
          this.allContacts.push({
            name: contact.displayName,
            value: false
          });
        });
      },
      (error: any) => console.error(error)
    );
  }

  checkContactSelected() {
    return this.allContacts.filter((item) => {
        return item.value;
      }).length > 0;
  }

  saveMeeting() {
    //TODO: do something with this.newEvent and navigate to meeting overview page
  }

}


