import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { debounceTime, Observable } from 'rxjs';
import { AlertService } from 'src/app/_alert';
import { UnitService } from '../../service/unit.service';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-unit-create',
  templateUrl: './unit-create.component.html',
  styleUrls: ['./unit-create.component.scss'],
})
export class UnitCreateComponent implements OnInit {

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  
  @Output() successFullCreateOrUpdate: EventEmitter<any> = new EventEmitter();
  @Output() cancelButtonClick: EventEmitter<any> = new EventEmitter();

  unitForm: FormGroup;
  @Input() id: number;
  units: any[] = [];
  constructor(
    private fb: FormBuilder,
    private unitService: UnitService,
    private alertService: AlertService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
    // private commonServiceService:CommonServiceService
  ) {}

  ngOnInit() {
    this.getUnits();
    this.createUnitForm();
    if (this.id > 0) {
      this.getUnitById(this.id);
    }
  }

  getUnits() {
    this.unitService.getUnitPagination(1, 1000, null).subscribe({
      next: (data: PaginatedResult<any[]>) => {
        this.units = data.result;
        console.log(data.result);

        if (data?.result?.length > 0) {
          return { spaceNotAllowed: 'true' };
        } else {
          return null;
        }
      },

      error: (err) => {
        this.units = [];
        return null;
      },
    });
  }

  getUnitById(id) {
    this.unitService.getById(id).subscribe(
      (data) => {
        this.unitForm.patchValue({
          id: data.id,
          name: data.name,
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
      required: 'Required.',
      checkExist: 'Already Exist.',
    },
  };

  formError = {
    name: '',
  };
  createUnitForm() {
    this.unitForm = this.fb.group({
      id: 0,
      name: ['', [Validators.required, this.checkExist()]],
      code: ''
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
    if (unit.id > 0) {
      this.unitService.updateUnit(unit).subscribe(
        (data) => {
          console.log(data);
          // this.alertService.success('Successfully Updated');
          this.showAlert(this.alertType.createSuccessAlert);
          this.successFullCreateOrUpdate.emit(data);
          this.unitService.onUnitCreated.next(data);
        },
        (err) => {
          console.log(err);
          this.alertService.error('Update Failed');
        }
      );
    } else {
      this.unitService.createUnit(unit).subscribe(
        (data) => {
          console.log(data);

          // this.alertService.success('Successfully Updated');
          this.showAlert(this.alertType.createSuccessAlert);
          this.successFullCreateOrUpdate.emit(data);
          this.unitService.onUnitCreated.next(data);
        },
        (err) => {
          console.log(err);
          this.alertService.error('Update Failed');
        }
      );
    }
    console.log(this.unitForm.value);
  }

  onCancel() {

    this.cancelButtonClick.emit(true)

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
      var found = this.units?.find(
        (c) => c.name.toLowerCase().trim() == value.toLowerCase().trim()
      );
      if (found) {
        return { checkExist: 'true' };
      } else {
        return null;
      }
    };
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
