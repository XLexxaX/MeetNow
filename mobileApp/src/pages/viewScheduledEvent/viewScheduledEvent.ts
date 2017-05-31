import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {RESTService} from '../services/RESTService';


@Component({
  selector: 'page-home',
  templateUrl: 'viewScheduledEvent.html',
  providers: [RESTService]
})

export class ViewScheduledEventPage {

  items: Array<any>;

  constructor(private navController: NavController, private restService: RESTService) {
    this.restService.get('The Hobbit: An Unexpected Journey').subscribe(
      data => {
        this.items = data.results;
        console.log(data);
      },
      err => {
        console.log(err);
      },
      () => console.log('Movie Search Complete')
    );
  }

}
