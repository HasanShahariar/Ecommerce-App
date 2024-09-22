import { BankService } from './../../services/bank.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/_alert';
import { DesignationService } from '../../services/designation.service';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-bank-create',
  templateUrl: './bank-create.component.html',
  styleUrls: ['./bank-create.component.scss'],
})
export class BankCreateComponent implements OnInit {
  @Output() cancelButtonClick:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() successFullCreateOrUpdate: EventEmitter<any> = new EventEmitter();
  bankForm: FormGroup;
  @Input() id: number;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  constructor(
    private fb: FormBuilder,
    private service: BankService,
    private alertService: AlertService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.createBankForm();
    if (this.id > 0) {
      this.getBankById(this.id);
    }
  }

  getBankById(id) {
    this.service.getById(id).subscribe(
      (data) => {
        this.bankForm.patchValue({
          id: data.id,
          name: data.name,
          code:data.code
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }


  validationMessages = {
    name: {
      required: 'Required.',
    },

  };

  formError = {
    name: '',
  };



  createBankForm() {
    this.bankForm = this.fb.group({
      id: 0,
      name: ['',[Validators.required]],
      code: '',
    });
  }
  onSubmit() {

    if (this.bankForm.invalid) {
      this.logValidationErrorsCeckingBeforeSubmit(this.bankForm);
      this.alertService.error('Please Provide Valid Information.');
      return;
    }


    var bank = this.bankForm.value;
    if (bank.id > 0) {
      this.service.updateBank(bank).subscribe(
        (data) => {
          console.log(data);
          // this.alertService.success('Successfully Updated');
      
          this.successFullCreateOrUpdate.emit(data);
          this.showAlert(this.alertType.createSuccessAlert);
        },
        (err) => {
          console.log(err);
          // this.alertService.error('Update Failed');
          this.showAlert(this.alertType.errorAlert);
        }
      );
    } else {
      this.service.createBank(bank).subscribe(
        (data) => {
          console.log(data);

          // this.alertService.success('Successfully Updated');
    
          this.successFullCreateOrUpdate.emit(data);
          this.showAlert(this.alertType.createSuccessAlert);
          this.service.onBankCreated.next(data);
        },
        (err) => {
          console.log(err);
          // this.alertService.error('Update Failed');
          this.showAlert(this.alertType.errorAlert);
        }
      );
    }
    console.log(this.bankForm.value);
  }

  onCancel() {
    this.cancelButtonClick.emit()

  }

  logValidationErrorsCeckingBeforeSubmit(
    group: FormGroup = this.bankForm
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

  logValidationErrors(group: FormGroup = this.bankForm): void {
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
