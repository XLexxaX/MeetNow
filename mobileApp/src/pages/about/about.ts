import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Marker, Circle
} from '@ionic-native/google-maps';

import {PopoverController} from 'ionic-angular';
import { ShareLinkPage } from '../share-link/share-link';


/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'

})
export class AboutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private googleMaps: GoogleMaps,
              public popoverCtrl: PopoverController) {
    GoogleMap
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  presentPopover() {
    let popover = this.popoverCtrl.create(ShareLinkPage);
    popover.present();
  }

  share() {
    alert("hello world");

/*    this.filePath.resolveNativePath(path)
      .then(filePath => console.log(filePath))
      .catch(err => console.log(err));*/
  }
}
