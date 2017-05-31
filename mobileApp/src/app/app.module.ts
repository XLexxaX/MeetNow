import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
<<<<<<< HEAD
import { ViewScheduledEventPage } from '../pages/viewScheduledEvent/viewScheduledEvent';
=======
import { AboutPage} from '../pages/about/about';
import { PlanEventPage } from '../pages/plan-event/plan-event';
>>>>>>> refs/remotes/origin/master

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
<<<<<<< HEAD
    ViewScheduledEventPage,
    SettingsPage
=======
    SettingsPage,
    AboutPage,
>>>>>>> refs/remotes/origin/master
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
<<<<<<< HEAD
    ViewScheduledEventPage,
    SettingsPage
=======
    SettingsPage,
    AboutPage,
>>>>>>> refs/remotes/origin/master
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
