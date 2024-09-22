import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  onCancelButtonClicked: Subject<any> = new Subject<any>();



}
