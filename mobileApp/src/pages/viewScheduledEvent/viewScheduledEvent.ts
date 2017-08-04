import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ActionSheetController, Events} from 'ionic-angular';
import {MeetingApi} from '../../services/MeetingApi';
import {LocalMeeting} from '../../model/LocalMeeting';
import {Storage} from '@ionic/storage';
import {HomePage} from '../home/home';
import {OneSignal} from '@ionic-native/onesignal';
import { SocialSharing } from '@ionic-native/social-sharing';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Marker, Circle
} from '@ionic-native/google-maps';


@Component({
  selector: 'page-home',
  templateUrl: 'viewScheduledEvent.html',
  providers: [MeetingApi, SocialSharing]
})

export class ViewScheduledEventPage {

  allItemsParticipants: Array<String>;
  item: LocalMeeting;
  _OneSignal: any;


  mapPressedTimeout: number;
  map: GoogleMap;
  activeMarker: Marker;
  circle: Circle;

  constructor(private navController: NavController, public navParams: NavParams, private meetingApi: MeetingApi,
              private storage: Storage, private oneSignal: OneSignal, private socialSharing: SocialSharing,
              private googleMaps: GoogleMaps, public events: Events) {

    this.item = this.navParams.get('meeting');
    this._OneSignal = oneSignal;


    this.allItemsParticipants = [];

    var that = this;
    this.storage.get('user').then((data) => {
      var found = false;

      if (data) {
        if (data.id) {


          that.item.meeting.participants.forEach((value) => {

            if (value.id === data.id) {
              that.allItemsParticipants.push("Me");
            } else {
              that.allItemsParticipants.push(value.name);
            }
          });


          if (data.id === that.item.meeting.ownerId) {
            found = true;
            that.allItemsParticipants.push("Me");
          }
          if (!found) {
            that.storage.get('contact').then((datax) => {
              if (datax && datax!=null) {
                for (var i=0; i<datax.length; i++) {
                  if (datax[i].id === that.item.meeting.ownerId) {
                    that.allItemsParticipants.push(datax[i].name);
                  }
                }
              }
            })
          }

        }
      }

    })




  }

  removeEvent() {
    var that = this;
    this.meetingApi.removeMeeting(this.item.meeting).subscribe(
      (responseStatus) => {
        if (responseStatus === 200 || responseStatus === 404) {

          that.storage.get('meetings').then((keys) => {
            if (keys != null) {
              let tmp_events: Array<LocalMeeting> = [];
              for (let i = 0; i < keys.length; i++) {
                let event: LocalMeeting = keys[i];
                if (event.meeting.id !== that.item.meeting.id) {
                  tmp_events.push(event);
                }
              }
              this.storage.set('meetings', tmp_events).then((res) => {
                this.navController.setRoot(HomePage);
              });
            }
          });
          //this._OneSignal.postNotification(notificationObj,
          //  function(successResponse) {
          //    console.log("Notification Post Success:", successResponse);
          //  },
          //  function (failedResponse) {
          //    console.log("Notification Post Failed: ", failedResponse);
          //  }
          //)
        } else {
          alert("It was not possible to remove this event. Server returned: " + responseStatus);
        }
      }
    );
  }

  share(socialNet: string) {

    console.log("Sharing in", socialNet);

    let message = "Hello, I organized " + this.item.meeting.name
      + " with you for the duration of " + this.item.meeting.duration + " minutes."
      + " I like to meet you " + this.item.meeting.reoccurrence + ".";

    let receiver;
    let phoneNumber;
    let to;
    let subject = "Participation information from meetNow"


    switch (socialNet) {
      case "whatsapp": {
        this.socialSharing.shareViaWhatsAppToReceiver(receiver, message, null, null).catch(
          reason => console.log("Couldn't share meeting" + reason)
        );
        break;
      }
      case "mail": {
        this.socialSharing.shareViaEmail(message, subject, to, null, null, null).catch(
          reason => console.log("Couldn't share meeting" + reason));
        break;
      }
      case "text": {
        this.socialSharing.shareViaSMS(message, phoneNumber).catch(
          reason => console.log("Couldn't share meeting" + reason));
        break;
      }
    }
  }

  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map2');

    this.map = this.googleMaps.create(element);
    console.log(this.map.getLicenseInfo());
    // listen to MAP_READY event
    // You must wait for this event to fire before adding something to the map or modifying it in anyway
    let that = this;
    this.map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        console.log('Map is ready!');
        //Now you can add elements to the map like the marker
        let startingPosition: LatLng = new LatLng(that.item.meeting.area.latitude, that.item.meeting.area.longitude);

        that.createCircleAroundLocation(startingPosition);

        // create CameraPosition
        let position: CameraPosition = {
          target: startingPosition,
          zoom: 10,
          tilt: 0
        };

        // move the map's camera to position
        that.map.moveCamera(position);
      }
    );

    // // create LatLng object


  }


  createCircleAroundLocation(loc: LatLng) {
    if (this.circle) {
      this.circle.remove();
    }

    this.map.addCircle({
      center: loc,
      radius: this.item.meeting.area.radius,
      strokeColor: '#FF0000',
      strokeWidth: 5,
      fillColor: '#F78181'
    }).then((circle: Circle) => {
      this.circle = circle;
    });
  }

  ionViewWillLeave() {
    this.map.remove();
  }
}






