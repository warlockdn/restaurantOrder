import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Menu, Events, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { HomePage } from '../pages/home/home';
import { OrderStatusPage } from '../pages/order-status/order-status';

import { AuthProvider } from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class ClientApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  isLoggedIn: boolean = false;

  // used for an example of ngFor and navigation
  loggedInMenu: Array<{title: string, subtitle: string, component: any}> = [
    { title: 'Home', subtitle: '', component: HomePage },
    { title: 'List', subtitle: 'History, Payments, etc.', component: HomePage },
    { title: 'Coupons', subtitle: '', component: HomePage },
    { title: 'Points', subtitle: '', component: HomePage },
    { title: 'Settings', subtitle: 'Accounts, Reviews, Referrals, etc.', component: HomePage }
  ];

  notLoggedInMenu: Array<{title: string, subtitle: string, component?: any, disabled: boolean }> = [
    { title: 'Home', subtitle: '', component: HomePage, disabled: false },
    { title: 'List', subtitle: 'History, Payments, etc.', disabled: true },
    { title: 'Coupons', subtitle: '', disabled: true },
    { title: 'Points', subtitle: '', disabled: true },
    { title: 'Settings', subtitle: 'Accounts, Reviews, Referrals, etc.', disabled: true }
  ]

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    private storage: Storage, 
    private auth: AuthProvider,
    public menu: MenuController,
    public events: Events
  ) {
    
    this.storage.get('tutorialSeen')
      .then((seen) => {
        if (seen) {
          this.rootPage = HomePage
        } else {
          this.rootPage = WalkthroughPage
        }
        this.initializeApp();
      });

    this.auth.loggedInStatus().then((status) => {
      if (status) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    })

    this.menu.enable(true);
    this.listenToLoginEvents();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.isLoggedIn = true;
    });

    this.events.subscribe('user:logout', () => {
      this.isLoggedIn = false;
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    if (page.disabled) {
      return;
    }
    
    this.nav.setRoot(page.component);
  }
}
