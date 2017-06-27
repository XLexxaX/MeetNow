import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AboutPage} from '../about/about';
import { ViewScheduledEventPage } from '../viewScheduledEvent/viewScheduledEvent';
import {Meeting} from '../../gen/model/Meeting';
import {LocalMeeting} from '../../model/LocalMeeting';
import { Storage } from '@ionic/storage';
import {MeetingApi} from '../../services/MeetingApi';
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
    var d1 = new Date("June 21, 2017 08:00:00");
    var d2 = new Date("June 21, 2017 16:00:00");
    this.calculateFreeTimes(d1,d2);



    this.refreshMeetingsFromStorage();


  }

  /*Returns a two-dimensional array with all free times according to the phone's calendar.*/
  calculateFreeTimes(start: Date, end: Date) {
    return this.calendar.listEventsInRange(start, end).then(
      (succ) => {
        console.log(start)
        var freetimes = [[start, end]];
        for (var i = 0; i < succ.length; i++) {


          let tmp_start: Date = new Date(succ[i].dtstart);
          let tmp_end: Date = new Date(succ[i].dtend);

          //special case: the event wraps the whole time slot to be checked.
          if (tmp_start <= start && tmp_end >= end) {
            console.log("wtf")
            return [];
          }

          if (tmp_start >= start) {
            freetimes[freetimes.length-1][1] = tmp_start;

            if (tmp_end < end) {
              freetimes.push([tmp_end, end]);
            } //otherwise do nothing.

          } else {
            if (freetimes[freetimes.length-1][1] < tmp_end) {
              freetimes[freetimes.length - 1] = [tmp_end, end];
              console.log("sfasdf")
            }

          }



        }
        console.log(freetimes);
        return freetimes;
      },
      (err) => {console.log("something went wrong when calculating free times."); return [];}
    );

  }


  refreshMeetingsFromStorage() {
    this.plannedEvents = [];
    this.scheduledEvents = [];

    this.storage.keys().then((keys) => {

      for (let i=0; i<keys.length; i++) {
        this.storage.get(keys[i]).then((data) => {
          let event: LocalMeeting = JSON.parse(data);
          this.plannedEvents.push(event);
          console.log(event)
          if (event.calendarId != undefined) {
            this.calendar.findEvent(event.meeting.name, undefined, undefined, undefined, undefined).then((d) => {
              this.scheduledEvents.push(event);
            });
          }
        });
      }

    });
  }




  itemTapped(event, item) {
    this.navCtrl.push(ViewScheduledEventPage, {
      meeting: item
    });
  }

  testNewCalendarEntry() {
    this.planEvent("3", new Date(2017, 5, 6, 15), new Date(2017, 5, 6, 16));
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
