import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {AboutPage} from '../about/about';
import {ViewScheduledEventPage} from '../viewScheduledEvent/viewScheduledEvent';
import {Meeting} from '../../gen/model/Meeting';
import {LocalMeeting} from '../../model/LocalMeeting';
import {Storage} from '@ionic/storage';
import {MeetingApi} from '../../services/MeetingApi';
import {Calendar} from '@ionic-native/calendar';
import {global} from '../../services/GlobalVariables';
import {User} from "../../gen/model/User";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  selectedItem: any;
  plannedEvents: Array<LocalMeeting>;
  scheduledEvents: Array<LocalMeeting>;
  aboutPage = AboutPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, private meetingApi: MeetingApi,
    private storage: Storage, private calendar: Calendar, private alertCtrl: AlertController) {
    // If we navigated to this page, we will have an item available as a nav param


    if(!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)){

      this.plannedEvents = [];
      this.scheduledEvents = [];
      global.plannedEvents = [];
      global.scheduledEvents = [];

        global.browser = true;
        var that = this;

        storage.get('user').then((user) => {
          if (!user || user==null) {

            let popup = this.alertCtrl.create({
              title: 'Login with your app-credentials',
              inputs: [
                {
                  name: 'UserID',
                  placeholder: 'UserID'
                },
                {
                  name: 'Secret',
                  placeholder: 'Secret',
                  type: 'password'
                }
              ],
              buttons: [
                {
                  text: 'Login',
                  handler: data => {
                    that.meetingApi.getMeetings(data.UserID+"", data.Secret+"").subscribe((meetingsFromServer) => {

                      that.plannedEvents = [];
                      meetingsFromServer.forEach((item) =>{
                        let tmp_LocalMeeting: LocalMeeting = {meeting: item};
                        that.plannedEvents.push(tmp_LocalMeeting);
                      });

                      that.storage.set('user',{id: data.UserID+"", secret: data.Secret+""}).then((succ) => {
                        console.log("user data saved")
                      }, (err) => {
                        console.warn("not possible to save user data.")
                      })

                      console.log("Successfully retrieved data from server.")
                    }, (err) => {
                      console.log(err);
                    });

                  }
                }
              ]
            });
            popup.present();

          } else {


            if (user.id && user.secret) {


              alert("You are logged in with UserID \'" + user.id + "\'. To log in with another user empty your browser\'s cache.");

              that.meetingApi.getMeetings(user.id + "", user.secret + "").subscribe((meetingsFromServer) => {

                that.plannedEvents = [];
                meetingsFromServer.forEach((item) => {
                  let tmp_LocalMeeting: LocalMeeting = {meeting: item};
                  that.plannedEvents.push(tmp_LocalMeeting);
                });

                console.log("Successfully retrieved data from server.")
              }, (err) => {
                alert("Invalid data found. Please empty your browser\'s cache.")
                console.log(err);
              });
            } else {
              alert("Invalid data found. Please empty your browser\'s cache.")
            }
          }
        });



    }

    this.selectedItem = navParams.get('item');
    if (this.selectedItem) {
      var bgGeo = (<any>window).BackgroundGeolocation;
      bgGeo.getGeofences(function (geofences) {
        console.log(geofences);
      }, function (err) {
        console.log(err)
      });
    }

    if (!global.browser) {
      var newMeetingArrived = navParams.get('newMeetingArrived');
      var scheduledMeetingId = navParams.get('scheduledMeetingId');
      if (newMeetingArrived != undefined) {
        this.plannedEvents = global.plannedEvents;
        this.scheduledEvents = global.scheduledEvents;
        let tmp_LocalMeeting: LocalMeeting = {meeting: newMeetingArrived};


        this.plannedEvents.push(tmp_LocalMeeting);

        this.storage.set('meetings', this.plannedEvents).then((res) => {
          global.plannedEvents = this.plannedEvents;


          var bgGeo = (<any>window).BackgroundGeolocation;
          bgGeo.addGeofence({
            identifier: tmp_LocalMeeting.meeting.id,
            radius: tmp_LocalMeeting.meeting.area.radius,
            latitude: tmp_LocalMeeting.meeting.area.latitude,
            longitude: tmp_LocalMeeting.meeting.area.longitude,
            notifyOnEntry: true,
            notifyOnExit: true,
            notifyOnDwell: false
          }, function () {
            console.log("Successfully added geofence");
          }, function (error) {
            console.warn("Failed to add geofence", error);
          });

        });

      } else if (scheduledMeetingId) {

        var that = this;

        var index = -1;
        for (var i = 0; i < global.plannedEvents.length; i++) {
          if (global.plannedEvents[i].meeting.id === scheduledMeetingId) {
            index = i;
          }
        }

        if (index >= 0) {
          var tmp = global.plannedEvents[index];
          global.plannedEvents.splice(index, 1);

          that.storage.set('meetings', global.plannedEvents).then((res) => {

            tmp.startDate = (new Date()) + "";
            var d = new Date();
            d = new Date(d.getTime() + tmp.meeting.duration * 60000);
            tmp.endDate = (d) + "";
            tmp.calendarId = that.guid() + "";
            global.plannedEvents.push(tmp);
            global.scheduledEvents.push(tmp);
            that.plannedEvents = global.plannedEvents;
            that.scheduledEvents = global.scheduledEvents;

            that.storage.set('meetings', global.plannedEvents).then((res) => {
              this.refreshMeetingsFromStorage();


              that.calendar.createEvent(global.plannedEvents[index].meeting.name, undefined, "A MeetNow Event", new Date(global.plannedEvents[index].startDate), new Date(global.plannedEvents[index].endDate)).then((succ) => {
                console.log("Meeting set in calendar.")
              }, (err) => {
                console.warn("Error when trying to set meeting in calendar.")
              })

            });

          });


        } else {
          that.plannedEvents = global.plannedEvents;
          that.scheduledEvents = global.scheduledEvents;
        }


      } else {
        this.refreshMeetingsFromStorage();

        if (!global.init) {
          global.init = true;
          this.calendar.createCalendar('MyCalendar').then(
            (msg) => {
              console.log(msg);
            },
            (err) => {
              console.log(err);
            }
          );
          this.calendar.hasReadWritePermission().then((d) => {
            if (!d)
              this.calendar.requestReadWritePermission();
          }, (d) => {
            //alert("Berechtigungen konnten nicht erlangt werden.")
          });
          //var d1 = new Date("June 21, 2017 08:00:00");
          //var d2 = new Date("June 21, 2017 16:00:00");
          //this.calculateFreeTimes(d1, d2);
        }

      }
    }
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
            freetimes[freetimes.length - 1][1] = tmp_start;

            if (tmp_end < end) {
              freetimes.push([tmp_end, end]);
            } //otherwise do nothing.

          } else {
            if (freetimes[freetimes.length - 1][1] < tmp_end) {
              freetimes[freetimes.length - 1] = [tmp_end, end];
              console.log("sfasdf")
            }

          }


        }
        console.log(freetimes);
        return freetimes;
      },
      (err) => {
        console.log("something went wrong when calculating free times.");
        return [];
      }
    );

  }


  refreshMeetingsFromStorage() {
    this.plannedEvents = [];
    this.scheduledEvents = [];

    this.storage.get('meetings').then((keys) => {
      if (keys!=null) {
        for (let i = 0; i < keys.length; i++) {
          let event: LocalMeeting = keys[i];
          this.plannedEvents.push(event);
          global.plannedEvents = this.plannedEvents;
          if (event.calendarId) {
            if (new Date(event.endDate) > new Date()) {
              this.scheduledEvents.push(event);
              global.scheduledEvents = this.scheduledEvents;
            } else {
              event.calendarId = undefined;
              event.endDate = undefined;
              event.startDate = undefined;
            }
          }
        }
      }
    });


  }

  itemTapped(event, item) {
    this.navCtrl.push(ViewScheduledEventPage, {
      meeting: item
    });
  }

  guid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

}
