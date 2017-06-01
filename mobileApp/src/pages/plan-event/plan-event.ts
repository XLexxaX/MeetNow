import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController  } from 'ionic-angular';

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



  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController) {


  }

  openActionSheet(){
    console.log('opening');
    let actionsheet = this.actionSheetCtrl.create({
      title:"Choose Album",
      buttons:[{
        text: 'Camera',
        handler: () => {
          alert("Camera Clicked");
        }
      },{
        text: 'Gallery',
        handler: function(){
          alert("Gallery Clicked");
        }
      }]
    });
    actionsheet.present();
  }


  checkStatusEventCategoryIsSet(){

    alert("working");
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad PlanEventPage');
  }





}
