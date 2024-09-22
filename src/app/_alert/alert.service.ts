import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Alert, AlertType } from './alert.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  options = {
    autoClose: true,
    keepAfterRouteChange: true,
  };
  modalOptions = {
    autoClose: false,
    keepAfterRouteChange: true,
  };
  private subject = new Subject<Alert>();
  private defaultId = 'default-alert';

  // enable subscribing to alerts observable
  onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable().pipe(filter((x) => x && x.id === id));
  }

  // convenience methods
  success(message: string, options?: any) {
    options = this.options;
    this.alert(new Alert({ ...options, type: AlertType.Success, message }));
  }

  successModal(message: string, options?: any) {
    options = this.modalOptions;
    this.alert(
      new Alert({ ...options, type: AlertType.Success, message, modal: true })
    );
  }

  error(message: string, options?: any) {
    options = this.options;
    this.alert(new Alert({ ...options, type: AlertType.Error, message }));
  }

  errorModal(message: string, options?: any) {
    options = this.modalOptions;
    this.alert(
      new Alert({ ...options, type: AlertType.Error, message, modal: true })
    );
  }

  info(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Info, message }));
  }

  warn(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Warning, message }));
  }

  // main alert method
  alert(alert: Alert) {
    alert.id = alert.id || this.defaultId;
    this.subject.next(alert);
  }

  // clear alerts
  clear(id = this.defaultId) {
    this.subject.next(new Alert({ id }));
  }
}
