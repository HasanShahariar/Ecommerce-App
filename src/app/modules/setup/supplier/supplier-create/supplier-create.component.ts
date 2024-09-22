import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertService } from 'src/app/_alert';
import { SupplierService } from '../../services/supplier.service';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-supplier-create',
  templateUrl: './supplier-create.component.html',
  styleUrls: ['./supplier-create.component.scss']
})
export class SupplierCreateComponent implements OnInit {

  @Output() successFullCreateOrUpdate: EventEmitter<any> = new EventEmitter();
  @Output() cancelButtonClick: EventEmitter<any> = new EventEmitter();

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  unitForm: FormGroup;
  @Input() id: number;
  units: any[] = [];
  passwordShow: boolean;
  matchPasswordShow: boolean;
  matched: boolean;
  selectedRoles = [];
  constructor(
    private fb: FormBuilder,
    private service: SupplierService,
    private alertService: AlertService,
    private commonServiceService: CommonServiceService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    console.log(this.id);
    this.createUnitForm();
    if (this.id > 0) {
      this.getUnitById(this.id);
    }
  }

  getUnitById(id) {
    this.service.getById(id).subscribe(
      (data) => {
        console.log(data);
        this.unitForm.patchValue({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          contactPersonName: data.contactPersonName,
          code: data.code,
        });
      },

      (err) => {
        console.log(err);
      }
    );
  }
  validationMessages = {
    name: {
      required: 'First name is required.',
    },
    
    email: {
      pattern: 'Email is invalid.',
    },
    
    phone: {
      required: 'Phone Number is required.',
      pattern: 'Invalid phone number',
    },
    
 
  };

  formError = {
    name: '',
    email: '',
    whatsAppNumber: '',
    phone: '',
  };

  createUnitForm() {

    this.unitForm = this.fb.group({
      id: 0,
      name: ['', Validators.required],

      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ],
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(new RegExp('^(01)?[0-9]{9}$')),
        ],
      ],
      address: '',
      contactPersonName: '',
      code:''
    });

  }




  onSubmit() {
    

    if (this.unitForm.invalid) {
      this.logValidationErrorsCeckingBeforeSubmit(this.unitForm);
      this.alertService.error('Please Provide Valid Information.');
      console.log(this.formError);
      return;
    }


    var unit = this.unitForm.value;
    console.log(unit);
    if (unit.id > 0) {
      this.service.updateSupplier(unit).subscribe(
        (data) => {
          console.log(data);
          // this.alertService.success('Successfully Updated');
          this.showAlert(this.alertType.createSuccessAlert);
          this.successFullCreateOrUpdate.emit(data);
        },
        (err) => {
          console.log(err);
          this.alertService.error('Update Failed');
        }
      );
    } else {
      this.service.createSupplier(unit).subscribe(
        (data) => {
          console.log(data);

          // this.alertService.success('Successfully Created');
          this.showAlert(this.alertType.createSuccessAlert);
          this.successFullCreateOrUpdate.emit(data);
          this.service.onSupplierCreated.next(data);
        },
        (err) => {
          console.log(err);
          this.alertService.error(err[0]);
        }
      );
    }
  }

  onCancel() {
    this.cancelButtonClick.emit(true);

    this.commonServiceService.onCancelButtonClicked.next(true);
  }
  logValidationErrors(group: FormGroup = this.unitForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formError[key] = '';
      if (
        abstractControl &&
        abstractControl.invalid &&
        (abstractControl.touched ||
          abstractControl.dirty ||
          abstractControl.value !== '')
      ) {
        const message = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formError[key] += message[errorKey];
          }
        }
      }
    });
  }

  logValidationErrorsCeckingBeforeSubmit(
    group: FormGroup = this.unitForm
  ): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formError[key] = '';
      if (abstractControl && abstractControl.invalid) {
        const message = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formError[key] += message[errorKey];
          }
        }
      }
    });
  }

  checkExist() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      const rmTypeCode = value.trim();
      var found = this.units.find(
        (c) => c.name.toLowerCase().trim() == value.toLowerCase().trim()
      );
      if (found) {
        return { checkExist: 'true' };
      } else {
        return null;
      }
    };
  }



  newPassordType() {
    this.passwordShow = this.passwordShow ? false : true;
  }

  matchPassordType() {
    this.matchPasswordShow = this.matchPasswordShow ? false : true;
  }
  checkMatching(event) {
    if (
      event.target.value == this.unitForm.value.password ||
      event.target.value == ''
    ) {
      this.matched = true;
    } else {
      this.matched = false;
    }
  }

  
  showAlert(swalOptions: SweetAlertOptions) {
    this.alertType.setAlertTypeText('Purchase');
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign(
      {
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-' + style,
        },
      },
      swalOptions
    );
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }

}
