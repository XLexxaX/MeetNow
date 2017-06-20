import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
/**
 * Generated class for the MapsTestPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-maps-test',
  templateUrl: 'maps-test.html',
})
export class MapsTestPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private googleMaps: GoogleMaps) {

  }

  // Load map only after view is initialized
  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {


    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    let map: GoogleMap = this.googleMaps.create(element);

    // listen to MAP_READY event
    // You must wait for this event to fire before adding something to the map or modifying it in anyway
    map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        console.log('Map is ready!');
        // Now you can add elements to the map like the marker
      }
    );

    // // create LatLng object
    // let ionic: LatLng = new LatLng(43.0741904, -89.3809802);
    //
    // // create CameraPosition
    // let position: CameraPosition = {
    //   target: ionic,
    //   zoom: 18,
    //   tilt: 30
    // };
    //
    // // move the map's camera to position
    // map.moveCamera(position);
    //
    // // create new marker
    // let markerOptions: MarkerOptions = {
    //   position: ionic,
    //   title: 'Ionic'
    // };
    //
    // //const marker: Marker =
    // map.addMarker(markerOptions)
    //   .then((marker: Marker) => {
    //     marker.showInfoWindow();
    //   });
  }

}

