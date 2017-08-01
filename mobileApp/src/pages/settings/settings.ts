import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  private status: boolean;
  private isEnabled: boolean;
  private bgGeo = (<any>window).BackgroundGeolocation;
  private toggleValue = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.isEnabled = false;
    let that = this;

    this.bgGeo.getState(function (state) {
      that.isEnabled = true;
      that.status = state.enabled;
      that.toggleValue = state.enabled;
    });
  }


  private handleGeolocations() {
    this.status = !this.status;
    this.isEnabled = false;
    let that = this;
    if (this.status) {
      this.bgGeo.startGeofences(function (state) {
        console.log('Geofence monitoring started', state.trackingMode);
        that.isEnabled = true;
      });
    } else {
      this.bgGeo.stop(function (state) {
        console.log('Geofence monitoring stopped', state.trackingMode);
        that.isEnabled = true;
      });
    }
  }

  private updateView() {

  }
}
