import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SocialSharing} from '@ionic-native/social-sharing';
import {global} from '../../services/GlobalVariables';

/**
 * Generated class for the ContactsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  private contacts: Array<String>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private socialSharing: SocialSharing) {


    this.contacts = ["Alex", "Carmen"];

  }

  private addContact() {
    let message = "Add me on meetNow!";
    // let url = "meetnow://newContact/" + global.myPlayerId;
    // let href = "<a href=\"" + url + "\">" + url + "</a>";
    let href = "https://meetnow.com/" + global.myPlayerId;
    let subject = "Meet now invitation";
    this.socialSharing.share(message, subject, null, href).catch(
      reason => console.log("Couldn't share meeting" + reason)
    );
  }
}
