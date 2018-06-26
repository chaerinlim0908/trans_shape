import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';

/**
 * Generated class for the SupporterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-supporter',
  templateUrl: 'supporter.html',
})
export class SupporterPage {
	userprofiles;
	user;
	count;
	usernum;
  loading;
  loadComplete = false;
  ratingsA;
  ratingsB;
  ratingsC;
  ratingsD;
  constructor(public navCtrl: NavController, public navParams: NavParams, public chat: ChatProvider,
    public viewCtrl: ViewController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
  	
  }

  ionViewDidLoad() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
  	this.count = 0;
    this.chat.getallusersExceptbuddy().then((res) => {
      console.log('SupporterPage - getallusersExceptbuddy - userprofiles : ' + JSON.stringify(res));
    	this.userprofiles = res;
    	this.usernum = this.userprofiles.length;
      if (this.usernum == 0) {
        let alert = this.alertCtrl.create({
          title: '대화 가능한 서포터가 없습니다.',
          message: '현재 대화 중인 서포터를 제외한 다른 서포터가 없습니다.',
          buttons: [
            {
              text: '확인',
              role: 'cancel',
              handler: () => {
                this.loading.dismiss();
                this.navCtrl.setRoot('HomePage');
              }
            }
          ]
        });
        alert.present();
      } else {
        this.user = this.userprofiles[this.count];
        this.ratingsA = this.makeRating(0);
        this.ratingsB = this.makeRating(0);
        this.ratingsC = this.makeRating(0);
        this.ratingsD = this.makeRating(0);
        this.loadComplete = true;
      }
      this.loading.dismiss();
    });
  }

  nextSupporter() {
    if (this.usernum <= 1) {
      return;
    }
  	this.count++;
  	if (this.count == this.usernum) {
  		this.count = 0;
  	}
  	this.user = this.userprofiles[this.count];
  }

  sendRequest() {
    this.chat.initializebuddy(this.userprofiles[this.count]);
    this.navCtrl.push('SupporterchatPage').then(() => {
      var index = this.viewCtrl.index;
      this.navCtrl.remove(index);
    });
  }

  makeRating(num) {
    var ratings = [];
    for (var i = 1; i < 6; i++) { 
      var rating: any = {};
      if (i <= num) {
        rating.src = 'assets/star-full.png';
      } else {
        rating.src = 'assets/star.png';
      }
      ratings.push(rating);
    }
    // console.log(JSON.stringify(ratings));
    return ratings;
  }

}
