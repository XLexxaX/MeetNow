import {Component} from '@angular/core';
import {Meeting} from '../../gen/model/Meeting'
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Contacts, Contact, ContactField, ContactName} from '@ionic-native/contacts';
import {LocalMeeting} from '../../model/LocalMeeting';
import {HomePage} from '../home/home';
import {Storage} from '@ionic/storage';
import {MeetingApi} from '../../services/MeetingApi';

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
  allContacts = [];
  searchQuery: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private contacts: Contacts, private meetingApi: MeetingApi, private storage: Storage) {
    this.newEvent = navParams.get('meeting');
    this.newEvent.participants = [];
    this.initializeContacts();
  }

  initializeContacts() {
    this.contacts.find(['name'], {hasPhoneNumber: true})
      .then(
        (allContacts: Contact[]) => {
          console.log(allContacts);
          allContacts = allContacts.filter((contact) => {
            let hasPhoneNumber = false;
            contact.phoneNumbers.forEach((phoneNumber) => {
              if (phoneNumber.type === "mobile") {
                hasPhoneNumber = true;
              }
            })
            return hasPhoneNumber;
          });

          allContacts.forEach((contact) => {
            let phoneNumbers = [];
            contact.phoneNumbers.forEach((phoneNumber) => {
              phoneNumbers.push(phoneNumber.value);
            });
            this.allContacts.push({
              name: contact.displayName,
              value: false,
              phoneNumbers: phoneNumbers
            });
          });
        },
        (error: any) => {
          console.error(error);
          console.log("using some sample contacts");
          this.allContacts = [
            {name: 'Anna Huber', value: false, phoneNumbers: ['0800']},
            {name: 'Carlo Müller', value: false, phoneNumbers: ['0801']},
            {name: 'Daniel Obert', value: false, phoneNumbers: ['0802']},
            {name: 'Gertrude Pohl', value: false, phoneNumbers: ['0803']}
          ];
        }
      );
  }

  checkContactSelected() {
    return this.allContacts.filter((item) => {
        return item.value;
      }).length > 0;
  }

  saveMeeting() {

    //add participants to this.newEvent
    this.allContacts.filter((item) => {
      return item.value;
    }).forEach((item) => {
      this.newEvent.participants.push({
        phoneNumbers: item.phoneNumbers,
        name: item.name,
      })
    });

    console.log(this.newEvent)

    let newLocalEvent: LocalMeeting = {meeting: this.newEvent};

    var tmp_res = this.meetingApi.addMeeting(newLocalEvent.meeting);

    tmp_res.subscribe(
      (succ: Object) => {
        //return data;

        let event_id: string = JSON.parse(JSON.stringify(succ)).id;

        this.storage.set(event_id, JSON.stringify(newLocalEvent)).then((res) => {

          this.navCtrl.setRoot(HomePage);

        })
      },
    (err) => {

      alert("Keine Verbindung zum Server möglich - Andere Teilnehmer erhalten keine Einladung.")

      this.navCtrl.setRoot(HomePage);

    });

  }

}


