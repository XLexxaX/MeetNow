import {Component, ViewChild} from '@angular/core';
import {Nav, Platform, Events} from 'ionic-angular';
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
import {User} from "../gen/model/User";
import {Deeplinks} from "@ionic-native/deeplinks";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;


  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  aboutPage = AboutPage;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              public events: Events, public meetingApi: MeetingApi, public storage: Storage, public deeplinks: Deeplinks) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Home', component: HomePage},
      {title: 'Event planen', component: PlanEventPage},
      {title: 'Contacts', component: ContactsPage},
      {title: 'Einstellungen', component: SettingsPage},
      {title: 'Lizenzen', component: AboutPage},
    ];

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

    if (this.platform.is('cordova')) {
      var notificationOpenedCallback = function (jsonData) {

        var payload = jsonData.notification.payload.additionalData;
        let newLocalEvent: LocalMeeting = {meeting: payload.meeting};
        var currentPage = nav.getActive().component.name + "";


        var payload = jsonData.notification.payload.additionalData;
        console.log(payload)
        switch (payload.operation) {
          case "0":

            if (currentPage === "HomePage") {
              if (payload.meeting != undefined && payload.meeting != null) {
                nav.setRoot(HomePage, {'newMeetingArrived': payload.meeting});
              }
            }

            break;
          case "1":
            //delete operation
            break;
          default:
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
        if (user == null || !global.myPlayerId) {
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
    if (this.platform.is("cordova")) {
      var bgGeo = (<any>window).BackgroundGeolocation;
      bgGeo.configure({
        desiredAccuracy: 10,
        distanceFilter: 50,
        stopOnTerminate: false,
        startOnBoot: true,
        debug: true,
      }, function (state) {
        if (!state.enabled) {
          bgGeo.startGeofences(function (state) {
            console.log('- Geofence-only monitoring started', state.trackingMode);
          });
        }
      });
      // Fired whenever a geofence transition occurs.
      bgGeo.on('geofence', function (geofence) {
        console.log('- onGeofence: ', geofence.identifier, geofence.location);
        let response = this.meetingApi.enterArea(123245);
        response.subscribe((succ: Object) => {
            //TODO maybe do something if the server returns no push
            alert("Geofence transitation posted successfully");
          },
          (err) => {
            alert("Failed to post location");
          });
      });
    }
  }

  private initializeDeeplinks() {
    let that = this;
    let callbackFunction = function(eventData){
      console.log("app opened from universal links:" + eventData);
      if(eventData.params.id){
        that.nav.push(ContactsPage, {
          id: eventData.params.id
        });
      }
    };

    if(window["universalLinks"]) {
      window["universalLinks"].subscribe(null, callbackFunction)
    };

    // console.log("Initializing deeplinks");
    // this.deeplinks.routeWithNavController(this.nav, {
    //   '/about-us': AboutPage,
    //   '/contacts': ContactsPage
    // }).subscribe((match) => {
    //   // match.$route - the route we matched, which is the matched entry from the arguments to route()
    //   // match.$args - the args passed in the link
    //   // match.$link - the full link data
    //   console.log('Successfully matched route', match);
    // }, (nomatch) => {
    //   // nomatch.$link - the full link data
    //   console.error('Got a deeplink that didn\'t match', nomatch);
    // });
    // console.log("Initialized deeplinks");
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
