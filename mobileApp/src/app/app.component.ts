import {Component, ViewChild} from '@angular/core';
import {Nav, Platform, Events} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {SettingsPage} from '../pages/settings/settings';

import {HomePage} from '../pages/home/home';
import {AboutPage} from '../pages/about/about';
import {PlanEventPage} from '../pages/plan-event/plan-event';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;


  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  aboutPage = AboutPage;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public events: Events) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Home', component: HomePage},
      {title: 'Einstellungen', component: SettingsPage},
      {title: 'Event planen', component: PlanEventPage},
      {title: 'Über uns', component: AboutPage},
    ];

    var notificationOpenedCallback = function(jsonData) {
      alert('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };

    window["plugins"].OneSignal
      .startInit("2e7109e7-d60a-4723-9a51-0edac1fa6e94", "277400593026")
      .handleNotificationOpened(notificationOpenedCallback)
      .endInit();


  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
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
