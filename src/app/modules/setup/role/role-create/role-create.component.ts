import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';
import { AlertService } from 'src/app/_alert';
import { DesignationService } from '../../services/designation.service';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.scss'],
})
export class RoleCreateComponent implements OnInit {
  @Output() successFullCreateOrUpdate: EventEmitter<any> = new EventEmitter();
  @Output() cancelButtonClicekd: EventEmitter<any> = new EventEmitter();
  designationForm: FormGroup;
  @Input() id: number;
  constructor(
    private fb: FormBuilder,
    private service: RoleService,
    private alertService: AlertService,
    public commonServiceService: CommonServiceService
  ) {}

  ngOnInit() {
    this.createdesignationForm();
    if (this.id > 0) {
      this.getUnitById(this.id);
    }
  }

  getUnitById(id) {
    this.service.getById(id).subscribe(
      (data) => {
        this.designationForm.patchValue({
          id: data.id,
          name: data.name,
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
  createdesignationForm() {
    this.designationForm = this.fb.group({
      id: 0,
      name: ['', Validators.required],
    });
  }
  onSubmit() {
    if (this.designationForm.invalid) {
      this.logValidationErrorsCeckingBeforeSubmit(this.designationForm);
      this.alertService.error('Please Provide Valid Information.');
      return;
    }
    var unit = this.designationForm.value;
    if (unit.id > 0) {
      this.service.updateRole(unit).subscribe(
        (data) => {
          console.log(data);
          this.alertService.success('Successfully Updated');
          this.successFullCreateOrUpdate.emit(data);
          this.cancelButtonClicekd.emit(true);
        },
        (err) => {
          console.log(err);
          this.alertService.error('Update Failed');
        }
      );
    } else {
      this.service.createRole(unit).subscribe(
        (data) => {
          console.log(data);

          this.alertService.success('Successfully Updated');
          this.service.onRoleCreated.next(data);
          this.successFullCreateOrUpdate.emit(data);
          this.cancelButtonClicekd.emit(true);
        },
        (err) => {
          console.log(err);
          this.alertService.error('Update Failed');
        }
      );
    }
    console.log(this.designationForm.value);
  }

  onCancel() {
    this.commonServiceService.onCancelButtonClicked.next(true);

    this.cancelButtonClicekd.emit(true);
  }
  logValidationErrors(group: FormGroup = this.designationForm): void {
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
    group: FormGroup = this.designationForm
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
}
