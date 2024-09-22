import { Injectable } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertTypeService {

constructor() { }

errorAlert: SweetAlertOptions = {
  icon: 'error',
  title: 'Error!',
  text: 'Something went wrong!',
};
createSuccessAlert: SweetAlertOptions = {
  icon: 'success',
  title: 'Success!',
};
updateSuccessAlert: SweetAlertOptions = {
  icon: 'success',
  title: 'Success!',
};
deleteSuccessAlert: SweetAlertOptions = {
  icon: 'success',
  title: 'Success!',
};

setAlertTypeText(text){
  this.createSuccessAlert.text = text+' created successfully!';
  this.updateSuccessAlert.text = text+' updated successfully!';
  this.deleteSuccessAlert.text = text+' deleted successfully!';
}

}
