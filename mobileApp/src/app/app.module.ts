import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';

import { ViewScheduledEventPage } from '../pages/viewScheduledEvent/viewScheduledEvent';

import { AboutPage} from '../pages/about/about';
import { PlanEventPage } from '../pages/plan-event/plan-event';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import {MeetingApi} from '../gen/api/MeetingApi';
import { Calendar } from '@ionic-native/calendar';

@NgModule({
  declarations: [
    MyApp,
    HomePage,

    ViewScheduledEventPage,

    SettingsPage,
    AboutPage,
    PlanEventPage,
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

    SettingsPage,
    AboutPage,
    PlanEventPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MeetingApi,
    Calendar,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
