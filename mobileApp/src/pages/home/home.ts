import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AboutPage} from '../about/about';
import { ViewScheduledEventPage } from '../viewScheduledEvent/viewScheduledEvent';
import {Meeting} from '../../gen/model/Meeting';
import { Storage } from '@ionic/storage';
import {MeetingApi} from '../../gen/api/MeetingApi';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  selectedItem: any;
  testmeeting: Meeting;
  plannedEvents: Array<Meeting>;
  scheduledEvents: Array<{title: string, id: number, startTime: string, endTime: string}>;
  aboutPage = AboutPage;


  constructor(public navCtrl: NavController, public navParams: NavParams, private meetingApi: MeetingApi, private storage: Storage) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');






    this.scheduledEvents = [];
    for (let i = 1; i <= 2; i++) {
      this.scheduledEvents.push({
        title: 'Ereignis ' + i,
        id: i,
        startTime: '10:00',
        endTime: '11:00'
      });
    }


    this.plannedEvents = [];
    this.testmeeting = {
      id:"0",
      ownerId: "3",
      reoccurrence: Meeting.ReoccurrenceEnum.Weekly,
      name: "Testmeeting",
      category: Meeting.CategoryEnum.Coffeebreak,
      areas: [{}]
    };
    this.addMeeting(this.testmeeting);
    this.testmeeting = {
      id:"1",
        ownerId: "3",
      reoccurrence: Meeting.ReoccurrenceEnum.Monthly,
      name: "AnotherMeeting",
      category: Meeting.CategoryEnum.Lunch,
      areas: [{}]
    }
    this.addMeeting(this.testmeeting);

    this.getMeetingsFromStorage();

    //ONLY FOR TEST PURPOSES!!!
    this.storage.clear();


  }

  getMeetingsFromStorage() {
    this.storage.keys().then((keys) => {
      console.log(keys)
      for (let i=0; i<keys.length; i++) {

        this.storage.get(keys[i]).then((val) => {
          this.plannedEvents.push(JSON.parse(val));
        });

      }

    });
  }


  addMeeting(meeting: Meeting) {

    var tmp_res = this.meetingApi.addMeeting(meeting);
    var res = tmp_res.subscribe(data => {
      return data
    });
    console.log(res);
    if (!res.closed) {
      //set storage
    } else {
      //notify user??
    }

    this.storage.set(meeting.id, JSON.stringify(meeting)).then(function success(res) {
    }, function error(res) {
      //remove event on server.
    });
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ViewScheduledEventPage);
  }

}
