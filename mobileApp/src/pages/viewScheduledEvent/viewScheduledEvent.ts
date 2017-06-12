import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {RESTService} from '../../services/RESTService';
import {LocalMeeting} from '../../model/LocalMeeting';


@Component({
  selector: 'page-home',
  templateUrl: 'viewScheduledEvent.html',
  providers: [RESTService]
})

export class ViewScheduledEventPage {

  item: LocalMeeting;

  constructor(private navController: NavController, public navParams: NavParams, private restService: RESTService) {

    this.item = this.navParams.get('meeting');
console.log(this.item.meeting.participants);
  }

}
