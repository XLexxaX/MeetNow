import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SocialSharing} from '@ionic-native/social-sharing';
import {global} from '../../services/GlobalVariables';
import {AlertController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {OneSignal} from '@ionic-native/onesignal';

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

  private contacts: Array<{ id: String, name: String }>;
  private _oneSignal: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private socialSharing: SocialSharing,
              private alertCtrl: AlertController, private storage: Storage, private oneSignal: OneSignal) {

    this.storage.get("contact").then((contact) => {
      this.contacts = contact || [];
    });
    this._oneSignal = this.oneSignal;

    //navigation to this page with another userId. Show the dialog to add a display name
    let id = this.navParams.get('id');
    if (id) {
      this.addNewContact(id);
    }
  }

  private addNewContact(id: any) {
    let alert = this.alertCtrl.create({
      title: 'Add a new Contact',
      inputs: [
        {
          name: 'username',
          placeholder: 'Define a display name for your new contact'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',  //The user b added user a. Now store the user in the storage and send a push notification back
          handler: data => {
            console.log("Save clicked");
            this.contacts.push({id: id, name: data.username});
            this.storage.set("contact",this.contacts);
            this.storage.get("user").then(user => {
              let notificationObj = {
                contents: {en: "You have been added"},
                include_player_ids: [id],
                data: {"operation": "2", "id": user.id},
                small_icon:"../pages/plan_event3/screen.png",
                icon:"../pages/plan_event3/screen.png"
              };
              //the code for how this notification is received on the other side is inside app.component.ts,
              //in the method initializeOneSignal (operation id --> 2)
              this._oneSignal.postNotification(notificationObj,
                function (successResponse) {
                  console.log("Notification Post Success:", successResponse);
                },
                function (failedResponse) {
                  console.log("Notification Post Failed: ", failedResponse);
                }
              )
            });
          }
        }
      ]
    });
    alert.present();
  }

  private addContact() {

    //use the socialsharing plugin to connect to users to each other.
    let message = "Add me on meetNow!";
    this.storage.get("user").then(
      user => {
        //universal link which will open in the meetnow app
        let href = "https://meetnow.cfapps.eu10.hana.ondemand.com/contact?id=" + user.id;
        let subject = "Meet now invitation";
        this.socialSharing.share(message, subject, null, href).catch(
          reason => console.log("Couldn't share meeting" + reason)
        );
      }
    )

  }
}
