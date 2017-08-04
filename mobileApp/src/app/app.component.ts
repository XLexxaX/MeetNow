import {Component, ViewChild} from '@angular/core';
import {Nav, Platform, Events, AlertController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {SettingsPage} from '../pages/settings/settings';
import {Storage} from '@ionic/storage';
import {HomePage} from '../pages/home/home';
import {AboutPage} from '../pages/about/about';
import {PlanEventPage} from '../pages/plan-event/plan-event';
import {ContactsPage} from "../pages/contacts/contacts";
import {global} from '../services/GlobalVariables';
import {LocalMeeting} from '../model/LocalMeeting';
import {MeetingApi} from '../services/MeetingApi';
import {ConsentManagementApi} from '../services/ConsentManagementApi';
import {User} from "../gen/model/User";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;


  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  aboutPage = AboutPage;

  BackgroundGeolocation = (<any>window).BackgroundGeolocation;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              public events: Events, public cma: ConsentManagementApi, public meetingApi: MeetingApi, public storage: Storage, private alertCtrl: AlertController) {
    this.initializeApp();

    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
      this.pages = [ //mobile
        {title: 'Overview', component: HomePage},
        {title: 'Plan event', component: PlanEventPage},
        {title: 'Contacts', component: ContactsPage},
        {title: 'Settings', component: SettingsPage},
        {title: 'Licences', component: AboutPage},
      ];
    } else { //desktop browser, limited functionality
      this.pages = [{title: 'Overview', component: HomePage}];
    }

  }


  initializeApp() {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.initializeOneSignal(this.nav);
      this.initializeGeofences();
      this.initializeDeeplinks();
    });
  }


  initializeOneSignal(nav) {
    var that = this;
    if (this.platform.is('cordova')) {
      var notificationOpenedCallback = function (jsonData) {

        var currentPage = nav.getActive().component.name + "";


        var payload = jsonData.notification.payload.additionalData;
        switch (payload.operation) {
          case "0":

            if (payload.meeting && payload.meeting != null) {
              nav.setRoot(HomePage, {'newMeetingArrived': payload.meeting});
            }

            break;
          case "1":
            //delete operation
            break;
          case "2":
            console.log("opened notification to add user");
            that.storage.get("contact").then((contact) => {
              if (!payload.userId) {
                let alert = that.alertCtrl.create({
                  title: 'Add a new Contact',
                  inputs: [
                    {
                      name: 'username',
                      placeholder: 'Define a display name for your new contact'
                    },
                  ],
                  buttons: [
                    {
                      text: 'Cancel',
                      role: 'cancel',
                      handler: data => {
                        console.log('Cancel clicked');
                      }
                    },
                    {
                      text: 'Save',
                      handler: data => {
                        contact = contact || [];
                        contact.push({id: payload.id, name: data.username})
                        that.storage.set("contact", contact);

                      }
                    }
                  ]
                });
                alert.present();
              }
            });
            break;
          case "4":
            if (payload.id) {

              let currentEvent: Array<LocalMeeting> = global.plannedEvents.filter((item) => {
                return item.meeting.id === payload.id;
              })

              if (currentEvent) {
                if (currentEvent.length > 0) {

                  let alert = that.alertCtrl.create({
                    title: 'Do you have time now?',
                    message: 'All participants of the meeting \'' + currentEvent[0].meeting.name + '\' are in the set area. Do you have time now to attend the meeting?',
                    buttons: [
                      {
                        text: 'Yes',
                        handler: () => {
                          that.cma.consent("yes", payload.id, global.myPlayerId).subscribe((success) => {
                            console.log('User accepted meeting - Post successful.');
                          }, (error) => {
                            console.warn('User accepted meeting - Post unsuccessful.');
                            console.log(error);
                          });
                        }
                      }, {
                        text: 'No',
                        role: 'cancel',
                        handler: () => {
                          that.cma.consent("no", payload.id, global.myPlayerId).subscribe((success) => {
                            console.log('User declined meeting - Post successful.');
                          }, (error) => {
                            console.warn('User declined meeting - Post unsuccessful');
                            console.log(error);
                          });
                        }
                      }

                    ]
                  });
                  alert.present();

                }
              }
            } else {
              alert("An error occured after receiving a notification: Unsufficient information provided.");
            }
            break;
          case "5":

            nav.setRoot(HomePage, {'scheduledMeetingId': payload.id});
            break;

          default:
            console.log("No operation id defined! Id is " + payload.operation)
            break;
        }
      };
    }
    if (window["plugins"]) {
      window["plugins"].OneSignal.getIds((id) => {
        console.log(id.userId);
        global.myPlayerId = id.userId;
        this.initializeAppOnFirstStartUp();
      });

      window["plugins"].OneSignal
        .startInit("2e7109e7-d60a-4723-9a51-0edac1fa6e94", "277400593026")
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();
    }
  }

  initializeAppOnFirstStartUp() {
    this.storage.get("user").then(
      (user: User) => {
        if (user == null || user || !global.myPlayerId) {
          this.meetingApi.newUser(global.myPlayerId).subscribe(
            (user: User) => {
              this.storage.set("user", user)
            },
            (error) => {
              console.log("Couldn't connect to the backend, " + error)
            }
          );
        } else {
          console.log("Running in emulator or app not opened for the first time")
        }
      }
    );
  }

  initializeGeofences() {
    //geofence mode for backgroud geoloation app, default settings for monitoring
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
      var that = this;
      if (this.platform.is("cordova")) {
        this.BackgroundGeolocation.configure({
          desiredAccuracy: 0,
          distanceFilter: 10,
          stopOnTerminate: false,
          startOnBoot: true,
          debug: true,
        }, function (state) {
          console.log("background location plugin configured");
          if (!state.enabled) {
            that.BackgroundGeolocation.startGeofences(function (state) {
              console.log('Geofence-only monitoring started', state.trackingMode);
            });
          }
        });
        // Fired whenever a geofence transition occurs.
        // sends request to the backend
        this.BackgroundGeolocation.on('geofence', function (params, taskId) {
          console.log("geofence transition --");
          console.log(params);
          that.storage.get("user").then((user) => {
              //TODO read meeting id and monitor if geofence is left or entered to send the request
              let meetingId = params.identifier;
              let request: any;
              if (params.type === "ENTER") {
                request = that.meetingApi.enterArea(meetingId, user.id);
              } else {
                request = that.meetingApi.leaveArea(meetingId, user.id);
              }
              if (request) {
                request.subscribe(
                  (succ: Object) => {
                    alert("Geofence transitation posted successfully");
                    that.BackgroundGeolocation.finish(taskId);
                  },
                  (err) => {
                    alert("Failed to post location" + err);
                    console.log(err);
                    that.BackgroundGeolocation.finish(taskId);
                  });
              } else {
                console.warn("meetingApi-request not defined");
              }
            },
            (error) => {
              that.BackgroundGeolocation.finish(taskId)
            }
          );
        });
      }
    }
  }

  // deeplinks for navigation to our app. trigger navigation to the contacts page
  private initializeDeeplinks() {
    let that = this;
    let callbackFunction = function (eventData) {
      console.log("app opened from universal links");
      if (eventData.params.id) {
        that.nav.push(ContactsPage, {
          id: eventData.params.id
        });
      }
    };

    if (window["universalLinks"]) {
      window["universalLinks"].subscribe(null, callbackFunction)
    }
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  menuClosed() {
    this.events.publish('menu:closed', '');
  }

  menuOpened() {
    this.events.publish('menu:opened', '');
  }
}
