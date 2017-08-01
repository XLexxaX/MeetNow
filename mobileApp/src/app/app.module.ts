import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {HttpModule} from '@angular/http';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {SettingsPage} from '../pages/settings/settings';
import {ContactsPage} from "../pages/contacts/contacts";
import {ViewScheduledEventPage} from '../pages/viewScheduledEvent/viewScheduledEvent';

import {AboutPage} from '../pages/about/about';
import {PlanEventPage} from '../pages/plan-event/plan-event';
import {PlanEvent2Page} from '../pages/plan-event2/plan-event2';
import {PlanEvent3Page} from '../pages/plan-event3/plan-event3';


import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {IonicStorageModule} from '@ionic/storage';
import {MeetingApi} from '../services/MeetingApi';
import {Calendar} from '@ionic-native/calendar';
import {GoogleMaps} from '@ionic-native/google-maps'
import {Geofence} from "@ionic-native/geofence";
import {OneSignal} from "@ionic-native/onesignal";
import {SocialSharing} from "@ionic-native/social-sharing";
import {ConsentManagementApi} from "../services/ConsentManagementApi";

@NgModule({
  declarations: [
    MyApp,
    HomePage,

    ViewScheduledEventPage,
    ContactsPage,
    SettingsPage,
    AboutPage,
    PlanEventPage,
    PlanEvent2Page,
    PlanEvent3Page,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,

    ViewScheduledEventPage,
    ContactsPage,
    SettingsPage,
    AboutPage,
    PlanEventPage,
    PlanEvent2Page,
    PlanEvent3Page
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MeetingApi,
    ConsentManagementApi,
    Calendar,
    GoogleMaps,
    Geofence,
    OneSignal,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
