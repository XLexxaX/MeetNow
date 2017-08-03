import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import {MeetingApi} from '../../services/MeetingApi';
import {LocalMeeting} from '../../model/LocalMeeting';
import {Storage} from '@ionic/storage';
import {HomePage} from '../home/home';
import {OneSignal} from '@ionic-native/onesignal';
import {global} from '../../services/GlobalVariables';
import { SocialSharing } from '@ionic-native/social-sharing';


@Component({
  selector: 'page-home',
  templateUrl: 'viewScheduledEvent.html',
  providers: [MeetingApi, SocialSharing]
})

export class ViewScheduledEventPage {

  item: LocalMeeting;
  _OneSignal: any;

  constructor(private navController: NavController, public navParams: NavParams, private meetingApi: MeetingApi,
              private storage:Storage, private oneSignal: OneSignal,   private socialSharing: SocialSharing) {

    this.item = this.navParams.get('meeting');
    this._OneSignal = oneSignal;

  }

  removeEvent() {
    var that = this;
    this.meetingApi.removeMeeting(this.item.meeting).subscribe(
      (responseStatus) => {
        if(responseStatus === 200 ||responseStatus === 404) {

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
      + " I like to meet you " +    this.item.meeting.reoccurrence + ".";

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


  }






