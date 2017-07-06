import {Component, ViewChild} from '@angular/core';
import {Nav, Platform, Events} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Storage} from '@ionic/storage';

import {SettingsPage} from '../pages/settings/settings';

import {HomePage} from '../pages/home/home';
import {AboutPage} from '../pages/about/about';
import {PlanEventPage} from '../pages/plan-event/plan-event';
import {global} from '../services/GlobalVariables';

import {MeetingApi} from '../services/MeetingApi';
import {User} from "../gen/model/User";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;


  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  aboutPage = AboutPage;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              public events: Events, public meetingApi: MeetingApi, public storage: Storage) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Home', component: HomePage},
      {title: 'Einstellungen', component: SettingsPage},
      {title: 'Event planen', component: PlanEventPage},
      {title: 'Lizenzen', component: AboutPage},
    ];

    if (this.platform.is('cordova')) {
      var notificationOpenedCallback = function (jsonData) {
        alert('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      };

      window["plugins"].OneSignal.getIds((id) => {
        console.log(id.userId);
        global.myPlayerId = id.userId;
      });

      window["plugins"].OneSignal
        .startInit("2e7109e7-d60a-4723-9a51-0edac1fa6e94", "277400593026")
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();

      this.initializeAppOnFirstStartUp();
    }
  }

  initializeAppOnFirstStartUp() {
    this.storage.get("user").then(
      (user: User) => {
        if (user == null) {
          this.meetingApi.newUser(global.myPlayerId).subscribe(
            (user: User) => {
              this.storage.set("user", user)
            },
            (error) => {
              console.log("Couldn't connect to the backend, " + error)
            }
          );
        }
      }
    );
  }


  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initializeGeofences();
    });
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
