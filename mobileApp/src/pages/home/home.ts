import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AboutPage} from '../about/about';
import { ViewScheduledEventPage } from '../viewScheduledEvent/viewScheduledEvent';
import {Meeting} from '../../gen/model/Meeting';
import {LocalMeeting} from '../../model/LocalMeeting';
import { Storage } from '@ionic/storage';
import {MeetingApi} from '../../gen/api/MeetingApi';
import { Calendar } from '@ionic-native/calendar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  selectedItem: any;
  plannedEvents: Array<LocalMeeting>;
  scheduledEvents: Array<LocalMeeting>;
  aboutPage = AboutPage;


  constructor(public navCtrl: NavController, public navParams: NavParams, private meetingApi: MeetingApi, private storage: Storage, private calendar: Calendar) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');






    this.refreshMeetingsFromStorage();



  }

  refreshMeetingsFromStorage() {
    this.plannedEvents = [];
    this.storage.keys().then((keys) => {
      console.log(keys);
      for (let i=0; i<keys.length; i++) {

        this.storage.get(keys[i]).then((data) => {
          this.plannedEvents.push(JSON.parse(data));
        });

      }

    });

    this.scheduledEvents = [];
    for(let event of this.plannedEvents) {
      if (event.calendarId != null) {
        this.scheduledEvents.push(event);
      }
    }
  }


  addMeeting(localmeeting: LocalMeeting) {

    var tmp_res = this.meetingApi.addMeeting(localmeeting.meeting);

      return tmp_res.subscribe(
        (data) => {
          //return data;
          this.storage.set(localmeeting.meeting.id, JSON.stringify(localmeeting)).then((res) => {

          })
            .catch((res) => {
              console.log("hihihi")
              this.storage.set(localmeeting.meeting.id, JSON.stringify(localmeeting)).then((res) => {
                alert("Meeting API not available.")
              })
              //remove event on server.
            });
        });



  }

  itemTapped(event, item) {
    this.navCtrl.push(ViewScheduledEventPage);
  }

  testNewCalendarEntry() {
    this.planEvent("3", new Date(2017, 6, 6, 15), new Date(2017, 6, 6, 16));
  }
  testNewEvent() {
    let testmeeting: Meeting = {
      id:"2",
      ownerId: "3",
      reoccurrence: Meeting.ReoccurrenceEnum.Weekly,
      name: "Testmeeting",
      category: Meeting.CategoryEnum.Coffeebreak,
      areas: [{}]
    };
    let localtestmeeting: LocalMeeting = {
      meeting: testmeeting
    }
    this.addMeeting(localtestmeeting);
    this.storage.set(localtestmeeting.meeting.id, JSON.stringify(localtestmeeting)).then((res) => {

    });
    testmeeting = {
      id:"3",
      ownerId: "3",
      reoccurrence: Meeting.ReoccurrenceEnum.Monthly,
      name: "AnotherMeeting",
      category: Meeting.CategoryEnum.Lunch,
      areas: [{}]
    }
    localtestmeeting = {
      meeting: testmeeting
    }
    this.addMeeting(localtestmeeting);
    this.storage.set(localtestmeeting.meeting.id, JSON.stringify(localtestmeeting)).then((res) => {
      alert("Meeting API not available.")
      this.refreshMeetingsFromStorage();
    });

   // this.refreshMeetingsFromStorage();
  }

  planEvent(eventId: string, startDate: Date, endDate: Date) {
    for(let event of this.plannedEvents) {
      if (eventId == event.meeting.id) {
        this.calendar.createEvent("Testtermin", "Mannheim", "Keine Notizen", startDate, endDate).then(
          (msg) => { console.log("Calendar operation message: " + msg); },
          (err) => { console.log("Calendar operation error: " + err); }
        );
        this.calendar.findEvent("Testtermin", "Mannheim", "Keine Notizen", startDate, endDate).then(
          (msg) => {
            event.calendarId = msg+"";
            event.startDate = startDate;
            event.endDate = endDate;
            this.scheduledEvents.push(event);
          },
          (err) => { console.log("Calendar operation error: " + err);
            alert("Kein Termin im Kalender erstellt - Termin wird trotzdem hier im Kalender angezeigt.");
            event.calendarId = "2150";
            event.startDate = startDate;
            event.endDate = endDate;
            this.scheduledEvents.push(event); }
        );
        this.addMeeting(event);
      }
    }
  }

}
