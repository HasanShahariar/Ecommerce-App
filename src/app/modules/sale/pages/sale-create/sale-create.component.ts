import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { DatePipe, Location } from "@angular/common";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AlertService } from "src/app/_alert/alert.service";
import { ProductService } from "src/app/modules/setup/services/product.service";
import { SupplierService } from "src/app/modules/setup/services/supplier.service";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { SweetAlertOptions } from "sweetalert2";
import { AlertTypeService } from "src/app/shared/services/alert-type.service";
import { SaleService } from "../../services/sale.service";
import { CustomerService } from "src/app/modules/setup/services/customer.service";
@Component({
  selector: 'app-sale-create',
  templateUrl: './sale-create.component.html',
  styleUrls: ['./sale-create.component.scss']
})
export class SaleCreateComponent implements OnInit {

  ItemList: any = [];
  saleForm: FormGroup;
  isDisabled = false;
  productSaleDetailArray: any = [];
  itemId: any;
  totalLostQty = 0;
  totalFoundQty = 0;
  customerList: any[];
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private productService: ProductService,
    private service: SaleService,
    private _datePipe: DatePipe,
    private _location: Location,
    private _router: Router,
    private _route: ActivatedRoute,
    private sustomerService: CustomerService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

    this._route.params.subscribe((params) => {
      const itemId = +params["id"];
      this.itemId = itemId;
      if (itemId) {
        this.getProductSaleById(itemId);
      }
    });
    this.createSaleForm();
    this.getAllProductList();
    this.getSupplierPagination();
  }

  getSupplierPagination() {

    this.sustomerService
      .getCustomerPagination(1, 1000)
      .subscribe(
        (data) => {
          this.customerList = data.result;
          console.log(data.result);
        },
        (err) => {
          console.log(err);

        }
      );
  }

  createSaleForm() {
    this.saleForm = this.fb.group({

      id: 0,
      code: [""],
      saleDate: this._datePipe.transform(new Date(), "yyyy-MM-dd"),
      customerId: [null, Validators.required],
      remarks: "",
      taxAmount: null,
      totalAmount: 0,
      discount: null,
      netAmount: 0,
      saleDetails: this.fb.array([]),
    });

    this.saleForm.get("saleDetails") as FormArray;
    if (!this.itemId) {
      this.createDetail();
    }
    this.productSaleDetailArray = (
      this.saleForm.get("saleDetails") as FormArray
    ).controls;
  }

  validationMessages = {
    customerId: {
      required: 'Required.',
    }
  };

  formError = {
    customerId: '',
  };

  createDetail() {

    const newItem = this.fb.group({
      id: 0,
      saleId: 0,
      productId: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      unitPrice: null,
      totalPrice: null,
      unitId: 0,
      unitName: '',

    });
    (this.saleForm.get("saleDetails") as FormArray).push(newItem);
  }

  setDataToForm(data) {
    

    this.saleForm.patchValue({
      id: data.id,
      code: data.code,
      saleDate: this._datePipe.transform(
        new Date(data.saleDate),
        "yyyy-MM-dd"
      ),
      customerId: data.customerId,
      remarks: data.remarks,
      taxAmount: data.taxAmount,
      totalAmount: data.totalAmount,
      netAmount: data.netAmount,
      discount: data.discount,


    });
    this.setDetailData(data.saleDetails);
    this.calculateSummary();
  }
  setDetailData(data) {
    
    
    var i = 0;
    data.forEach((element) => {
      debugger
      this.createDetail();
      this.productSaleDetailArray[i]
        .get("saleId")
        .patchValue(element.saleId),
        this.productSaleDetailArray[i].get("id").patchValue(element.id),
        this.productSaleDetailArray[i]
          .get("productId")
          .patchValue(element.productId),
        this.productSaleDetailArray[i]
          .get("quantity")
          .patchValue(element.quantity),
        this.productSaleDetailArray[i]
          .get("unitPrice")
          .patchValue(element.unitPrice),
        this.productSaleDetailArray[i]
          .get("totalPrice")
          .patchValue(element.totalPrice),
        this.productSaleDetailArray[i]
          .get("unitName")
          .patchValue(element.productSaleUnitName)
        i++;
    });
  }

  resetForm() {
    this.saleForm.reset();
  }

  handleBlur(formControl) {
    return formControl.valid || formControl.untouched;
  }

  getAllProductList() {

    this.productService.getProductFromViewPagination(1, 100000).subscribe(
      (data) => {
        this.ItemList = data.result ?? [];
      },
      (err) => {
        this.ItemList = [];
        console.log(err);
      }
    );
  }

  getProductSaleById(id) {
    this.service.getById(id).subscribe(
      (data) => {

        this.setDataToForm(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  addItemDetail(i) {
    this.createDetail();
  }
  addNewItem(data, i) {
    

    if (
      this.productSaleDetailArray.filter((c) => c.value.productId == data.id)
        .length > 1
    ) {
      this.alertService.error("This item is already added");

      this.productSaleDetailArray[i].get("productId").patchValue(null);
      this.productSaleDetailArray[i].get("quantity").patchValue(null);
      this.productSaleDetailArray[i].get("price").patchValue(null);
      this.productSaleDetailArray[i].get("unitId").patchValue(null);
      this.productSaleDetailArray[i].get("unitName").patchValue(null);
      this.productSaleDetailArray[i].get("totalAmount").patchValue(null);

      return;
    }
    else {
      
      this.productSaleDetailArray[i].get("unitId").patchValue(data.saleUnitId);
      this.productSaleDetailArray[i].get("unitName").patchValue(data.saleUnitName);
      // this.productSaleDetailArray[i].get("price").patchValue(data.salePrice);
      this.productSaleDetailArray[i].get("totalAmount").patchValue(0);
    }
  }

  removeItem(index: number) {
    (this.saleForm.get("saleDetails") as FormArray).removeAt(
      index
    );
  }
  calculateSummary() {
    


    var totalPrice = 0;
    var grandTotal = 0;
    this.productSaleDetailArray.forEach((element) => {
      var qty = element.get("quantity").value ?? 0;
      this.totalLostQty += qty;
      var price = element.get("unitPrice").value ?? 0;
      totalPrice = qty * price;
      grandTotal += totalPrice;
      element.get("totalPrice").patchValue(totalPrice);

    });
    
    var total = grandTotal+(this.saleForm.value.taxAmount?this.saleForm.value.taxAmount:0)
    this.saleForm.get("totalAmount").patchValue(total);
    this.saleForm.get("netAmount").patchValue(total-this.saleForm.value.discount);
  }

  onSubmit() {
    if (!this.saleForm.valid) {
      this.alertService.error("Please provide valid information");
      return;
    }

    if (this.saleForm.value.id == 0) {
      this.service
        .createSale(this.saleForm.value)
        .subscribe(
          (data) => {
            // this.alertService.success("Sale Saved Successfully");
            this.showAlert(this.alertType.createSuccessAlert);
            this._router.navigate(["sale/list"]);
          },
          (err) => {
            console.log(err);
            // this.alertService.error("Sale could not be Saved");
            this.showAlert(this.alertType.errorAlert);
          }
        );
    }
    else {
      
      this.service
        .updateSale(this.saleForm.value)
        .subscribe(
          (data) => {
            this.alertService.success("Sale Saved Successfully");
            this._router.navigate(["sale/list"]);
          },
          (err) => {
            console.log(err);
            this.alertService.error("Sale could not be Saved");
          }
        );
    }
  }
  goToListPage() {
    this._location.back();
  }
  logValidationErrors(group: FormGroup = this.saleForm): void {
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
    group: FormGroup = this.saleForm
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
  showAlert(swalOptions: SweetAlertOptions) {
    this.alertType.setAlertTypeText('Sale');
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
