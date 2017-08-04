import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ActionSheetController, Events} from 'ionic-angular';
import {Meeting} from '../../gen/model/Meeting'
import {PlanEvent2Page} from '../plan-event2/plan-event2';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Marker, Circle
} from '@ionic-native/google-maps';

/**
 * This class designs the event planning page.
 *
 *
 */
@IonicPage()

@Component({
  selector: 'page-plan-event',
  templateUrl: 'plan-event.html',

})
export class PlanEventPage {

  newEvent: Meeting;
  categories: Array<Meeting.CategoryEnum>;
  mapPressedTimeout: number;
  map: GoogleMap;
  activeMarker: Marker;
  circle: Circle;
  meetingAreaRadius: number = 100;
  sliderEnabled: boolean = false;
  searchQuery: string = "";
  // geocodingUrl = "https://maps.googleapis.com/maps/api/geocode/json";
  // geocodingAPIKey = "AIzaSyDyiwSsjT9BohgoI_I6qi2rzmemjxAjOh4";

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController,
              private googleMaps: GoogleMaps, public events: Events) {

    this.newEvent = {
      reoccurrence: null,
      name: "",
      area: {}
    };
    this.categories = [Meeting.CategoryEnum.Jourfix, Meeting.CategoryEnum.Lunch, Meeting.CategoryEnum.Coffeebreak]
  }

  ngAfterViewInit() {
    this.loadMap();
  }

  ionViewWillLeave() {
    this.map.remove(); //remove map on page leave to free resources
  }

  loadMap() {
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    this.map = this.googleMaps.create(element);
    console.log(this.map.getLicenseInfo());

    // listen to MAP_READY event
    let that = this;
    this.map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        console.log('Map is ready!');
        that.initializeEventListeners();
        //Now you can add elements to the map like the marker
        let startingPosition: LatLng = new LatLng(49.474163, 8.534974);

        // create CameraPosition
        let position: CameraPosition = {
          target: startingPosition,
          zoom: 10,
          tilt: 0
        };

        // move the map's camera to position
        that.map.moveCamera(position);
      }
    );

  }

  initializeEventListeners() {
    let that = this;
    this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe(
      (data) => {
        clearTimeout(this.mapPressedTimeout);
        this.mapPressedTimeout = setTimeout(function () {
          that.createMarkerAtLocation(data);
        }, 100)
      },

      (err) => {
        console.log(err);
      },
    );

    this.events.subscribe('menu:opened', () => {
      this.disableMap();
    });

    this.events.subscribe('menu:closed', () => {
      this.enableMap();
    });
  }

  enableMap() {
    if (this.map) {
      this.map.setClickable(true);
    }
  }

  disableMap() {
    if (this.map) {
      this.map.setClickable(false);
    }
  }

  createMarkerAtLocation(data: LatLng) {
    if (this.activeMarker) {
      this.activeMarker.remove();
    }

    let markerOptions: MarkerOptions = {
      position: data,
      title: 'Treffpunkt'
    };

    this.map.addMarker(markerOptions)
      .then((marker: Marker) => {
        this.activeMarker = marker;
        marker.showInfoWindow();
        this.createCircleAroundLocation(data);
      });

    this.newEvent.area = {
      longitude: data.lng,
      latitude: data.lat,
    }
  }

  onSliderChange() {
    this.circle.setRadius(this.meetingAreaRadius);
    this.newEvent.area.radius = this.meetingAreaRadius;
  }

  createCircleAroundLocation(loc: LatLng) {
    if (this.circle) {
      this.circle.remove();
    }

    this.map.addCircle({
      center: loc,
      radius: this.meetingAreaRadius,
      strokeColor: '#FF0000',
      strokeWidth: 5,
      fillColor: '#F78181'
    }).then((circle: Circle) => {
      this.circle = circle;
      this.sliderEnabled = true;
    });
  }

  checkIfValuesAreSet() {
    return this.newEvent.name !== "" && this.newEvent.category !== undefined;
  }

  callNextPage() {
    this.navCtrl.push(PlanEvent2Page, {
      meeting: this.newEvent
    });
  }

}
