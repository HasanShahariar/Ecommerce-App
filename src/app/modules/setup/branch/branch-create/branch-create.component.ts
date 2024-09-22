import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/_alert';
import { BranchServiceService } from '../../services/branch-service.service';
import { BankService } from '../../services/bank.service';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';

@Component({
  selector: 'app-branch-create',
  templateUrl: './branch-create.component.html',
  styleUrls: ['./branch-create.component.scss']
})
export class BranchCreateComponent implements OnInit {

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  @Output() cancelButtonClick:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() successFullCreateOrUpdate: EventEmitter<any> = new EventEmitter();
  branchForm: FormGroup;
  @Input() id: number;
  banks: any[];
  constructor(
    private fb: FormBuilder,
    private service: BranchServiceService,
    private bankService: BankService,
    private alertService: AlertService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.createbranchForm();
    if (this.id > 0) {
      
      this.getUnitById(this.id);
    }
    this.getBankList()
  }

  getUnitById(id) {
    this.service.getById(id).subscribe(
      (data) => {
        
        this.branchForm.patchValue({
          id: data.id,
          name: data.name,
          bankId: data.bankId,
          code: data.code,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getBankList() {

    this.bankService.getBankPagination(1,1000,"").subscribe({
      next:(data: PaginatedResult<any[]>) => {
        console.log(data.result);

        this.banks = data.result;
      },

    error:(err) => {

    }
  });
  }


  validationMessages = {
    name: {
      required: 'Required.',
    },

  };

  formError = {
    name: '',
  };



  createbranchForm() {
    this.branchForm = this.fb.group({
      id: 0,
      name: [null,[Validators.required]],
      bankId: [null,[Validators.required]],
      code: '',
    });
  }
  onSubmit() {

    if (this.branchForm.invalid) {
      this.logValidationErrorsCeckingBeforeSubmit(this.branchForm);
      this.alertService.error('Please Provide Valid Information.');
      return;
    }


    var unit = this.branchForm.value;
    if (unit.id > 0) {
      this.service.updateBranch(unit).subscribe(
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
      this.service.createBranch(unit).subscribe(
        (data) => {
          console.log(data);

          // this.alertService.success('Successfully Updated');
          this.showAlert(this.alertType.createSuccessAlert);
          this.successFullCreateOrUpdate.emit(data);
          this.service.onBranchCreated.next(data);
        },
        (err) => {
          console.log(err);
          this.alertService.error('Update Failed');
        }
      );
    }
    console.log(this.branchForm.value);
  }

  onCancel() {
    this.cancelButtonClick.emit()

  }

  logValidationErrorsCeckingBeforeSubmit(
    group: FormGroup = this.branchForm
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

  logValidationErrors(group: FormGroup = this.branchForm): void {
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
