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
  meetingAreaRadius: number = 300;
  sliderEnabled: boolean = false;
  searchQuery: string = "";
  // geocodingUrl = "https://maps.googleapis.com/maps/api/geocode/json";
  // geocodingAPIKey = "AIzaSyDyiwSsjT9BohgoI_I6qi2rzmemjxAjOh4";

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController,
              private googleMaps: GoogleMaps, public events: Events) {

    this.newEvent = {
      ownerId: "3",
      reoccurrence: null,
      name: "",
      area: {}
    };
    this.categories = [Meeting.CategoryEnum.Jourfix, Meeting.CategoryEnum.Lunch, Meeting.CategoryEnum.Coffeebreak]
  }

  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    this.map = this.googleMaps.create(element);
    console.log(this.map.getLicenseInfo());
    // listen to MAP_READY event
    // You must wait for this event to fire before adding something to the map or modifying it in anyway
    let that = this;
    this.map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        console.log('Map is ready!');
        that.map.getLicenseInfo().then((info) => console.log(info));
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

    // // create LatLng object


  }

  initializeEventListeners() {
    let that = this;
    this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe(
      (data) => {
        clearTimeout(this.mapPressedTimeout);
        this.mapPressedTimeout = setTimeout(function () {
          that.createMarkerAtLocation(data);
          console.log("function called");
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

    //TODO make number in API
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
      radius: 500,
      strokeColor: '#FF0000',
      strokeWidth: 5,
      fillColor: '#F78181'
    }).then((circle: Circle) => {
      this.circle = circle;
      this.sliderEnabled = true;
    });
  }

  // ionic already does this for us, maybe need to change if search should be called less often
  // searchbarChanged(){
  //   clearTimeout(this.searchbarTimeout);
  //   console.log("clearing timeout");
  //   let that = this;
  //   this.searchbarTimeout = setTimeout(function () {
  //     that.showLocationOnTheMap();
  //   }, 500);
  // }

  // showLocationOnTheMap() {
  //   let headers = new Headers();
  //   headers.append('Content-Type', 'application/x-www-form-urlencoded');
  //   this.http.get(this.geocodingUrl + "?address=" + encodeURI(this.searchQuery) + "&key=" + this.geocodingAPIKey,
  //     {"headers": headers})
  //     .map(res => res.json())
  //     .subscribe(data => {
  //       switch (data.status) {
  //         case "OK":
  //           let location = data.results[0].geometry.location;
  //           let latLng = new LatLng(location.lat, location.lng);
  //           let position: CameraPosition = {
  //             target: latLng,
  //             zoom: 100,
  //             tilt: 0
  //           };
  //           // move the map's camera to position
  //           this.map.moveCamera(position);
  //           break;
  //         default:
  //           console.log("An error occurred");
  //           console.log(data);
  //       }
  //     });
  //   console.log("show Location on the map called")
  // }

  // showSelectedEventLocation(eventLocation) {
  //   this.newEvent.areas[0] = {
  //     id: eventLocation
  //   };
  // }

  checkIfValuesAreSet() {
    return this.newEvent.name !== "" && this.newEvent.category !== undefined;
  }

  callNextPage() {
    this.navCtrl.push(PlanEvent2Page, {
      meeting: this.newEvent
    });
  }

  ionViewWillLeave() {
    this.map.remove();
  }

}
