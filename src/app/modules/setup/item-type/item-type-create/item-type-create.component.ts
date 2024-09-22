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
import { ItemTypeService } from '../../services/item-type.service';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';


@Component({
  selector: 'app-item-type-create',
  templateUrl: './item-type-create.component.html',
  styleUrls: ['./item-type-create.component.scss']
})
export class ItemTypeCreateComponent implements OnInit {

  @Output() successFullCreateOrUpdate: EventEmitter<any> = new EventEmitter();
  @Output() cancelButtonClick: EventEmitter<any> = new EventEmitter();

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  itemTypeForm: FormGroup;
  @Input() id: number;
  itemTypes: any[] = [];
  constructor(
    private fb: FormBuilder,
    private itemTypeService: ItemTypeService,
    private alertService: AlertService,
    private commonServiceService:CommonServiceService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.getItemTypes();
    this.createItemTypeForm();
    if (this.id > 0) {
      this.getItemTypeById(this.id);
    }
  }

  getItemTypes() {
    this.itemTypeService.getItemTypePagination(1, 1000, null).subscribe({
      next: (data: PaginatedResult<any[]>) => {
        this.itemTypes = data.result;
        console.log(data.result);

        if (data.result?.length > 0) {
          return { spaceNotAllowed: 'true' };
        } else {
          return null;
        }
      },

      error: (err) => {
        this.itemTypes = [];
        return null;
      },
    });
  }

  getItemTypeById(id) {
    this.itemTypeService.getById(id).subscribe(
      (data) => {
        this.itemTypeForm.patchValue({
          id: data.id,
          name: data.name,
          pageCount: data.pageCount,
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
      checkExist: 'Already Exist.',
    },
    pageCount: {
      required: 'Required.',
    },
  };

  formError = {
    name: '',
    pageCount:''
  };
  createItemTypeForm() {
    this.itemTypeForm = this.fb.group({
      id: 0,
      name: ['', [Validators.required, this.checkExist()]],
      pageCount: [null, [Validators.required]],
      code:''
    });
  }
  onSubmit() {
    if (this.itemTypeForm.invalid) {
      this.logValidationErrorsCeckingBeforeSubmit(this.itemTypeForm);
      this.alertService.error('Please Provide Valid Information.');
      console.log(this.formError);
      return;
    }
    var itemType = this.itemTypeForm.value;
    if (itemType.id > 0) {
      this.itemTypeService.updateItemType(itemType).subscribe(
        (data) => {
          console.log(data);
          // this.alertService.success('Successfully Updated');
          this.showAlert(this.alertType.createSuccessAlert);
          this.successFullCreateOrUpdate.emit(data);
          this.itemTypeService.onItemTypeCreated.next(data);
        },
        (err) => {
          console.log(err);
          this.alertService.error('Update Failed');
        }
      );
    } else {
      this.itemTypeService.createItemType(itemType).subscribe(
        (data) => {
          console.log(data);

          // this.alertService.success('Successfully Updated');
          this.showAlert(this.alertType.createSuccessAlert);
          this.successFullCreateOrUpdate.emit(data);
          this.itemTypeService.onItemTypeCreated.next(data);
        },
        (err) => {
          console.log(err);
          this.alertService.error('Update Failed');
        }
      );
    }
    console.log(this.itemTypeForm.value);
  }

  onCancel() {

    this.cancelButtonClick.emit(true)

    this.commonServiceService.onCancelButtonClicked.next(true);
  }
  logValidationErrors(group: FormGroup = this.itemTypeForm): void {
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
    group: FormGroup = this.itemTypeForm
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
      var found = this.itemTypes.find(
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
