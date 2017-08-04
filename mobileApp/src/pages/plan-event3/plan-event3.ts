import {Component} from '@angular/core';
import {Meeting} from '../../gen/model/Meeting'
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {Contacts, Contact, ContactField, ContactName} from '@ionic-native/contacts';
import {LocalMeeting} from '../../model/LocalMeeting';
import {HomePage} from '../home/home';
import {Storage} from '@ionic/storage';
import {MeetingApi} from '../../services/MeetingApi';
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

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private contacts: Contacts,
              private meetingApi: MeetingApi, private storage: Storage, private oneSignal: OneSignal) {
    this.newEvent = navParams.get('meeting');
    this.newEvent.participants = [];
    this.initializeContacts();
    this._OneSignal = oneSignal;
  }

  initializeContacts() {
   // this.contacts.find(['name'], {hasPhoneNumber: true})
   //  .then(
   //    (allContacts: Contact[]) => {
   //      console.log(allContacts);
   //      allContacts = allContacts.filter((contact) => {
   //        let hasPhoneNumber = false;
   //        contact.phoneNumbers.forEach((phoneNumber) => {
   //          if (phoneNumber.type === "mobile") {
   //            hasPhoneNumber = true;
   //          }
   //        })
   //        return hasPhoneNumber;
   //      });
   //
   //      allContacts.forEach((contact) => {
   //        let phoneNumbers = [];
   //        contact.phoneNumbers.forEach((phoneNumber) => {
   //          phoneNumbers.push(phoneNumber.value);
   //        });
   //        this.allContacts.push({
   //          name: contact.displayName,
   //          value: false,
   //          phoneNumbers: phoneNumbers
   //        });
   //      });
   //    },
   //    (error: any) => {
   //      console.error(error);
   //      console.log("using some sample contacts");this.allContacts = [{name: 'Anna Huber', value: false, phoneNumbers: ['0800']}, {name: 'Carlo Müller', value: false, phoneNumbers: ['0801']}, {name: 'Daniel Obert', value: false, phoneNumbers: ['0802']}, {name: 'Gertrude Pohl', value: false, phoneNumbers: ['0803']}];
   //    }
   //  );
    this.storage.get("contact").then(
      contacts => this.allContacts = contacts || []
    )
   // this.allContacts = [{name:"Testname",id:"56sa7df"}]
  }

  checkContactSelected() {
    return this.allContacts.filter((item) => {
        return item.value;
      }).length > 0;
  }
  getSelectedContacts() {
    var selectedContacts = this.allContacts.filter((item) => {
        return item.value;
    });
    let ids: Array<any> = [];
    selectedContacts.forEach((item)=> {
      ids.push(item.id);
    })
    return ids;

  }

  /*
  * This method collects all the information given within the course of planning a meeting and transfer it into
  * one single object. This object is then sent to the server and stored in the phone's storage.
  * Likewise a geofence is set and the chosen participant's are notified with OneSignal push notification.
  * */
  saveMeeting() {
    //add participants to this.newEvent
    this.allContacts.filter((item) => {
      return item.value;
    }).forEach((item) => {
      this.newEvent.participants.push({
        id: item.id,
        name: item.name,
      })
    });

    //Bugfix for Huawei P7 Mini with Android KitKat
    this.newEvent.ownerId = global.myPlayerId;
    if (!this.newEvent.area.radius) {
      this.newEvent.area.radius = 100;
    }

//
    //}
    //let fence = {
    //  id: this.newEvent.area.id, //any unique ID
    //  latitude: this.newEvent.area.latitude, //center of geofence radius
    //  longitude: this.newEvent.area.latitude,
    //  radius: this.newEvent.area.radius, //radius to edge of geofence in meters
    //  transitionType: 3 //BOTH --> means enter and leave
    //}
//
    //this.geofence.addOrUpdate(fence).then(
    //  () => console.log('Geofence added'),
    //  (err) => console.log('Geofence failed to add')
    //);
//
    //this.geofence.onTransitionReceived().subscribe((geofences) => {
    //  if(geofences){
    //    geofences.forEach((geofence) => {
    //      console.log("Transitation received");
    //      console.log("Geofence");
    //    })
    //  }
    //});



    let newLocalEvent: LocalMeeting = {meeting: this.newEvent};

    var tmp_res = this.meetingApi.addMeeting(newLocalEvent.meeting);

    var that = this;

    tmp_res.subscribe(
      (succ: Object) => {
        //return data;
        let event_id: string = JSON.parse(JSON.stringify(succ)).id;
        newLocalEvent.meeting.id = event_id;


        this.storage.get('meetings').then((keys) =>
        {

          let data: Array<any> = [];

          if (keys != null) {
            data.push(newLocalEvent)
          } else {
            data = [newLocalEvent];
          }
          console.log("data is now:")
          console.log(data);

          this.storage.set('meetings', data).then((res) => {


            var notificationObj = { contents: {en: "Sie wurden einem Event hinzugefügt"},
              include_player_ids: this.getSelectedContacts(),
              data: {"operation":"0","meeting":newLocalEvent.meeting},
              small_icon:"../pages/plan_event3/screen.png",
              icon:"../pages/plan_event3/screen.png" };

            this._OneSignal.postNotification(notificationObj,
              function(successResponse) {

                  var bgGeo = (<any>window).BackgroundGeolocation;
                  bgGeo.addGeofence({
                    identifier: event_id,
                    radius: that.newEvent.area.radius,
                    latitude: that.newEvent.area.latitude,
                    longitude: that.newEvent.area.longitude,
                    notifyOnEntry: true,
                    notifyOnExit: true,
                    notifyOnDwell: false
                  }, function() {
                    console.log("Successfully added geofence");
                  }, function(error) {
                    console.warn("Failed to add geofence", error);
                  });

                console.log("Notification Post Success:", successResponse);
              },
              function (failedResponse) {
                console.log("Notification Post Failed: ", failedResponse);
              }
            )

            this.navCtrl.setRoot(HomePage);
          })

        })

     },
     (err) => {
       alert("Keine Verbindung zum Server möglich - Andere Teilnehmer erhalten keine Einladung.")

       this.navCtrl.setRoot(HomePage);
     });

  }

  // private guid(){
  //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  //     var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
  //     return v.toString(16);
  //   });
  // }

}


