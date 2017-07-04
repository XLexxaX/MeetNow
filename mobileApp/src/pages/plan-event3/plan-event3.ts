import {Component} from '@angular/core';
import {Meeting} from '../../gen/model/Meeting'
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Contacts, Contact, ContactField, ContactName} from '@ionic-native/contacts';
import {LocalMeeting} from '../../model/LocalMeeting';
import {HomePage} from '../home/home';
import {Storage} from '@ionic/storage';
import {MeetingApi} from '../../services/MeetingApi';
import {Geofence} from '@ionic-native/geofence';
import {OneSignal} from '@ionic-native/onesignal';
import {global} from '../../services/GlobalVariables';

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
  _OneSignal: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private contacts: Contacts,

              private meetingApi: MeetingApi, private storage: Storage, private oneSignal: OneSignal) {
    this.newEvent = navParams.get('meeting');
    this.newEvent.participants = [];
    this.initializeContacts();
    this._OneSignal = oneSignal;
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

    // if(platform.is("cordova")){
      var bgGeo = (<any>window).BackgroundGeolocation;
      bgGeo.addGeofence({
        identifier: this.newEvent.area.id,
        radius: this.newEvent.area.radius,
        latitude: this.newEvent.area.latitude,
        longitude: this.newEvent.area.longitude,
        notifyOnEntry: true,
        notifyOnExit: true,
        notifyOnDwell: false
      }, function() {
        console.log("Successfully added geofence");
      }, function(error) {
        console.warn("Failed to add geofence", error);
      });

    // }
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


          var notificationObj = { contents: {en: "You are participant in a new event."},
            include_player_ids: [global.myPlayerId]};

          window["plugins"].postNotification(notificationObj,
            function(successResponse) {
              console.log("Notification Post Success:", successResponse);
            },
            function (failedResponse) {
              console.log("Notification Post Failed: ", failedResponse);
              alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
            }
          )

          this.navCtrl.setRoot(HomePage);
        })
      },
      (err) => {
        alert("Keine Verbindung zum Server möglich - Andere Teilnehmer erhalten keine Einladung.")


        //Das hier muss noch raus -- aber erstmal zum Test
        var notificationObj = { contents: {en: "message body"},
          include_player_ids: ["0472c5a9-88f5-4489-89ad-0658c1391e3d"]};

        this._OneSignal.postNotification(notificationObj,
          function(successResponse) {
            console.log("Notification Post Success:", successResponse);
          },
          function (failedResponse) {
            console.log("Notification Post Failed: ", failedResponse);
            alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
          }
        )
        //bis hierher

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


