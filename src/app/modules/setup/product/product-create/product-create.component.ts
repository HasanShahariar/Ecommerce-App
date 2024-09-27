import { ProductService } from './../../services/product.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/_alert';
// import { PaginatedResult } from 'src/app/shared/model/pagination.model';
import { UnitService } from '../../unit/service/unit.service';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Location } from "@angular/common";

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {

  @Output() cancelButtonClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() successFullCreateOrUpdate: EventEmitter<any> = new EventEmitter();
  productForm: FormGroup;
  @Input() id: number;
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  units: any;
  constructor(
    private fb: FormBuilder,
    private service: ProductService,
    private alertService: AlertService,
    private unitService: UnitService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
    private _location: Location,
  ) { }

  ngOnInit() {
    this.createProductForm();
    this.getUnitList();
    if (this.id > 0) {
      this.getProductById(this.id);
    }
  }

  getUnitList() {
    this.unitService
      .getUnitPagination(1, 1000)
      .subscribe({
        next: (data: PaginatedResult<any[]>) => {
          this.units = data.result;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getProductById(id) {
    this.service.getById(id).subscribe(
      (data) => {
        this.productForm.patchValue({
          id: data.id,
          name: data.name,
          purchaseUnitId: data.purchaseUnitId,
          saleUnitId: data.saleUnitId,
          purchasePrice: data.purchasePrice,
          vat: data.vat,
          isEnable: data.isEnable,
          details: data.details,
          code: data.code,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  createProductForm() {
    this.productForm = this.fb.group({
      id: 0,
      name: ['', [Validators.required]],
      purchaseUnitId: 0,
      saleUnitId: 0,
      purchasePrice: 0,
      vat: 0,
      isEnable: true,
      details: "",
      code:''
    });
  }


  validationMessages = {
    name: {
      required: 'Required.',
    },
    purchaseUnitId: {
      required: 'Required.',
    },
    saleUnitId: {
      required: 'Required.',
    },
    purchasePrice: {
      required: 'Required.',
    }

  };

  formError = {
    name: '',
    purchaseUnitId: '',
    saleUnitId: '',
    purchasePrice: ''
  };




  onSubmit() {

    if (this.productForm.invalid) {
      this.logValidationErrorsCeckingBeforeSubmit(this.productForm);
      this.alertService.error('Please Provide Valid Information.');
      return;
    }


    var product = this.productForm.value;
    if (product.id > 0) {
      this.service.updateProduct(product).subscribe(
        (data) => {
          console.log(data);
          // this.alertService.success('Successfully Updated');
          this.showAlert(this.alertType.createSuccessAlert);
          this.successFullCreateOrUpdate.emit(data);
        },
        (err) => {
          console.log(err);
          // this.alertService.error('Update Failed');
          this.showAlert(this.alertType.errorAlert);
        }
      );
    } else {
      this.service.createProduct(product).subscribe(
        (data) => {
          console.log(data);

          // this.alertService.success('Successfully Updated');
          this.showAlert(this.alertType.createSuccessAlert);
          this.successFullCreateOrUpdate.emit(data);
          this.service.onProductCreated.next(data);
        },
        (err) => {
          console.log(err);
          // this.alertService.error('Update Failed');
          this.showAlert(this.alertType.errorAlert);
        }
      );
    }
    console.log(this.productForm.value);
  }

  onCancel() {
    this.cancelButtonClick.emit()

  }

  logValidationErrorsCeckingBeforeSubmit(
    group: FormGroup = this.productForm
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

  logValidationErrors(group: FormGroup = this.productForm): void {
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

  goToListPage() {
    this._location.back();
  }
}
