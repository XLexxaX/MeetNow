import {Component} from '@angular/core';
import {Meeting} from '../../gen/model/Meeting'
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Contacts, Contact, ContactField, ContactName} from '@ionic-native/contacts';
import {LocalMeeting} from '../../model/LocalMeeting';
import {HomePage} from '../home/home';
import {Storage} from '@ionic/storage';
import {MeetingApi} from '../../services/MeetingApi';
import {Geofence} from '@ionic-native/geofence';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private contacts: Contacts,
              private meetingApi: MeetingApi, private storage: Storage, private geofence: Geofence) {
    this.geofence.initialize();
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
    this.newEvent.area.id = this.guid();
    // let fence = {
    //   id: this.newEvent.area.id, //any unique ID
    //   latitude: this.newEvent.area.latitude, //center of geofence radius
    //   longitude: this.newEvent.area.latitude,
    //   radius: this.newEvent.area.radius, //radius to edge of geofence in meters
    //   transitionType: 3 //BOTH --> means enter and leave
    // }
    //
    // this.geofence.addOrUpdate(fence).then(
    //   () => console.log('Geofence added'),
    //   (err) => console.log('Geofence failed to add')
    // );
    //
    // this.geofence.onTransitionReceived().subscribe((geofences) => {
    //   if(geofences){
    //     geofences.forEach((geofence) => {
    //       console.log("Transitation received");
    //       console.log("Geofence");
    //     })
    //   }
    // });

    tmp_res.subscribe(
      (succ: Object) => {
        //return data;

        let event_id: string = JSON.parse(JSON.stringify(succ)).id;
        newLocalEvent.meeting.id = event_id;
        this.storage.set(event_id, JSON.stringify(newLocalEvent)).then((res) => {

          this.navCtrl.setRoot(HomePage);

        })
      },
      (err) => {

        alert("Keine Verbindung zum Server möglich - Andere Teilnehmer erhalten keine Einladung.")

        this.navCtrl.setRoot(HomePage);

      });

  }

  private guid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

}


