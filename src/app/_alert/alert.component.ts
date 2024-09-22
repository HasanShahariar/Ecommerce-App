import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

import { Alert, AlertType } from './alert.model';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['../_alert/alert.component.scss'],
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription: Subscription;
  routeSubscription: Subscription;
  alerType: { 0: string; 1: string; 2: string; 3: string };

  constructor(private router: Router, private alertService: AlertService) {}

  ngOnInit() {
    // subscribe to new alert notifications
    this.alertSubscription = this.alertService
      .onAlert(this.id)
      .subscribe((alert) => {
        // clear alerts when an empty alert is received
        if (!alert.message) {
          // filter out alerts without 'keepAfterRouteChange' flag
          this.alerts = this.alerts.filter((x) => x.keepAfterRouteChange);

          // remove 'keepAfterRouteChange' flag on the rest
          this.alerts.forEach((x) => delete x.keepAfterRouteChange);
          return;
        }

        // add alert to array
        this.alerts.push(alert);

        // auto close alert if required
        if (alert.autoClose) {
          setTimeout(() => this.removeAlert(alert), 6000);
        }
      });

    // clear alerts on location change
    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.alertService.clear(this.id);
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  // removeAlert(alert: Alert) {
  //   console.log('firs alart close (remove alart) called');
  //   // check if already removed to prevent error on auto close
  //   if (!this.alerts?.includes(alert)) return;
  //   console.log(this.alerts);
  //   // this.alerts = this.alerts.filter((x) => x !== alert);
  //   if (this.fade) {
  //
  //     console.log(this.alerts);
  //     console.log(alert);
  //     // fade out alert
  //     if (this.alerts.length > 0) {
  //       var index = this.alerts.findIndex((x) => x === alert);
  //       this.alerts[index].fade = true;
  //     }
  //     // this.alerts[0].fade = true;
  //     console.log('alart close (remove alart) called');
  //     //this.alerts = this.alerts.filter((x) => x !== alert);
  //     // remove alert after faded out

  //     setTimeout(() => {
  //       console.log('closed');
  //       this.alerts = this.alerts.filter((x) => x !== alert);
  //     }, 250);
  //   } else {
  //     // remove alert
  //     this.alerts = this.alerts.filter((x) => x !== alert);
  //   }
  // }

  removeAlert(alert: Alert) {
    // check if already removed to prevent error on auto close
    this.alerts = [];

    if (!this.alerts.includes(alert)) return;

    if (this.fade) {
      // fade out alert
      //this.alerts.find((x) => x === alert).fade = true;

      if (this.alerts.length > 0) {
        var index = this.alerts.findIndex((x) => x === alert);
        this.alerts[index].fade = true;
      }
      // remove alert after faded out
      setTimeout(() => {
        this.alerts = this.alerts.filter((x) => x !== alert);
      }, 250);
    } else {
      // remove alert
      this.alerts = this.alerts.filter((x) => x !== alert);
    }
  }

  cssClass(alert: Alert) {
    var that = this;
    if (!alert) return;

    const classes = ['alert', 'alert-dismissable'];

    const alertTypeClass = {
      [AlertType.Success]: 'alert-success',
      [AlertType.Error]: 'alert-danger',
      [AlertType.Info]: 'alert-info',
      [AlertType.Warning]: 'alert-warning',
    };
    var value =
      alert.type != null && alert.type != undefined
        ? alertTypeClass[alert.type]
        : null;
    if (value != null) {
      classes.push(value);
    }

    if (alert.fade) {
      classes.push('fade');
    }

    return classes.join(' ');
  }
}
