import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import {MeetingApi} from '../../services/MeetingApi';
import {LocalMeeting} from '../../model/LocalMeeting';
import {Storage} from '@ionic/storage';
import {HomePage} from '../home/home';


@Component({
  selector: 'page-home',
  templateUrl: 'viewScheduledEvent.html',
  providers: [MeetingApi]
})

export class ViewScheduledEventPage {

  item: LocalMeeting;

  constructor(private navController: NavController, public navParams: NavParams, private meetingApi: MeetingApi, private storage:Storage) {

    this.item = this.navParams.get('meeting');

  }

  removeEvent() {
    this.meetingApi.removeMeeting(this.item.meeting).subscribe(
      (responseStatus) => {
        if(responseStatus === 200 ||responseStatus === 404) {
          this.storage.remove(this.item.meeting.id).then(()=>{});
          this.navController.setRoot(HomePage);
        } else {
           alert("It was not possible to remove this event. Server returned: " + responseStatus);
        }
      }
    );
  }

}
