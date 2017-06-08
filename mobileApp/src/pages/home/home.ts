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


    this.calendar.createCalendar('MyCalendar').then(
      (msg) => { console.log(msg); },
      (err) => { console.log(err); }
    );
    this.calendar.hasReadWritePermission().then((d) => {
      if (!d)
        this.calendar.requestReadWritePermission();
    }, (d) => {
      //alert("Berechtigungen konnten nicht erlangt werden.")
    } );



    this.refreshMeetingsFromStorage();



  }


  refreshMeetingsFromStorage() {
    this.plannedEvents = [];
    this.scheduledEvents = [];

    this.storage.keys().then((keys) => {

      for (let i=0; i<keys.length; i++) {
        this.storage.get(keys[i]).then((data) => {
          let event: LocalMeeting = JSON.parse(data);
          this.plannedEvents.push(event);
          if (event.calendarId != undefined) {
            this.calendar.findEvent(event.meeting.name, undefined, undefined, undefined, undefined).then((d) => {
              this.scheduledEvents.push(event);
            });
          }
        });
      }

    });
  }


  addMeeting(localmeeting: LocalMeeting) {

    var tmp_res = this.meetingApi.addMeeting(localmeeting.meeting);

      return tmp_res.subscribe(
        (data) => {
          //return data;
          this.storage.set(localmeeting.meeting.id, JSON.stringify(localmeeting)).then((res) => {

          })
            .catch((res) => {
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
    this.planEvent("3", new Date(2017, 5, 6, 15), new Date(2017, 5, 6, 16));
  }
  testNewEvent() {
    if (this.plannedEvents.length==0) {
      let testmeeting: Meeting = {
        id: "2",
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
        id: "3",
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
    } else {
      this.refreshMeetingsFromStorage();
    }

  }

  planEvent(eventId: string, startDate: Date, endDate: Date) {
    for(let event of this.plannedEvents) {
      if (eventId == event.meeting.id) {



        this.calendar.createEventWithOptions("Testtermin", "Mannheim", "Keine Notizen", startDate, endDate, this.calendar.getCalendarOptions()).then(
          (msg) => { console.log("Calendar operation message: " + msg); },
          (err) => { console.log("Calendar operation error: " + err); }
        );
        this.calendar.findEvent("Testtermin", "Mannheim", undefined, undefined, undefined).then(
          (msg) => {
            console.log(msg)
            event.calendarId = msg+"";
            event.startDate = startDate;
            event.endDate = endDate;
            event.location = "Mannheim";
            this.scheduledEvents.push(event);
            this.storage.set(event.meeting.id, JSON.stringify(event)).then((res) => {
            })
          },
          (err) => { console.log("Calendar operation error: " + err);
            alert("Kein Termin im Kalender erstellt - Termin wird hier trotzdem temporär angezeigt.");
            event.calendarId = "2150";
            event.startDate = startDate;
            event.endDate = endDate;
            event.location = "Mannheim";
            this.scheduledEvents.push(event); }
        );


      }
    }
  }

}
