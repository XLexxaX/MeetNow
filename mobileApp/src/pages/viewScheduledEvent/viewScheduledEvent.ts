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
    this.meetingApi.removeMeeting(this.item.meeting).subscribe(
      (responseStatus) => {
        if(responseStatus === 200 ||responseStatus === 404) {
          this.storage.remove(this.item.meeting.id).then(()=>{});
          var notificationObj = { contents: {en: "Ein anderer Nutzer hat ein Event entfernt."},
            include_player_ids: [global.myPlayerId],
            data: {"operation":"1","meetingId":this.item.meeting.id}};

         //this._OneSignal.postNotification(notificationObj,
         //  function(successResponse) {
         //    console.log("Notification Post Success:", successResponse);
         //  },
         //  function (failedResponse) {
         //    console.log("Notification Post Failed: ", failedResponse);
         //  }
         //)
          this.navController.setRoot(HomePage);
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
      + " I like to meet you " +    this.item.meeting.reoccurrence + "."

    let receiver;

    let phoneNumber;

    let to;
    let subject = "Participation information from meetNow"


   // alert(message);

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






