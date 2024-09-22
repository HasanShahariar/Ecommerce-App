import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { DatePipe, Location } from "@angular/common";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { PurchaseService } from "../../services/purchase.service";
import { AlertService } from "src/app/_alert/alert.service";
import { ProductService } from "src/app/modules/setup/services/product.service";
import { SupplierService } from "src/app/modules/setup/services/supplier.service";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { SweetAlertOptions } from "sweetalert2";
import { AlertTypeService } from "src/app/shared/services/alert-type.service";

@Component({
  selector: 'app-purchase-create',
  templateUrl: './purchase-create.component.html',
  styleUrls: ['./purchase-create.component.scss']
})
export class PurchaseCreateComponent implements OnInit {

  ItemList: any = [];
  purchaseForm: FormGroup;
  isDisabled = false;
  productPurchaseDetailArray: any = [];
  itemId: any;
  totalLostQty = 0;
  totalFoundQty = 0;
  supplierList: any[];
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private productService: ProductService,
    private purchaseService: PurchaseService,
    private _datePipe: DatePipe,
    private _location: Location,
    private _router: Router,
    private _route: ActivatedRoute,
    private supplierService: SupplierService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

    this._route.params.subscribe((params) => {
      const itemId = +params["id"];
      this.itemId = itemId;
      if (itemId) {
        this.getProductPurchaseById(itemId);
      }
    });
    this.createNewForm();
    this.getAllProductList();
    this.getSupplierPagination();
  }

  getSupplierPagination() {

    this.supplierService
      .getSupplierPagination(1, 1000)
      .subscribe(
        (data) => {
          this.supplierList = data.result;
          console.log(data.result);
        },
        (err) => {
          console.log(err);

        }
      );
  }

  createNewForm() {
    this.purchaseForm = this.fb.group({

      id: 0,
      code: [" "],
      purchaseDate: this._datePipe.transform(new Date(), "yyyy-MM-dd"),
      supplierId: [null, Validators.required],
      entryDate: this._datePipe.transform(new Date(), "yyyy-MM-dd"),
      batchNumber: "",
      remarks: "",
      vatAmount: null,
      totalAmount: 0,
      shippingCost: null,
      purchaseDetail: this.fb.array([]),
    });

    this.purchaseForm.get("purchaseDetail") as FormArray;
    if (!this.itemId) {
      this.createDetail();
    }
    this.productPurchaseDetailArray = (
      this.purchaseForm.get("purchaseDetail") as FormArray
    ).controls;
  }

  validationMessages = {
    supplierId: {
      required: 'Required.',
    }
  };

  formError = {
    supplierId: '',
  };

  createDetail() {

    const newItem = this.fb.group({
      id: 0,
      purchaseId: 0,
      productId: [null, [Validators.required]],
      unitId: null,
      quantity: [0, [Validators.required]],
      price: [0, [Validators.required]],
      unitName: null,
      vatAmount: 0,
      totalAmount: 0,
      remarks: "",

    });
    (this.purchaseForm.get("purchaseDetail") as FormArray).push(newItem);
  }

  setDataToForm(data) {
    

    this.purchaseForm.patchValue({
      id: data.id,
      code: data.code,
      purchaseDate: this._datePipe.transform(
        new Date(data.purchaseDate),
        "yyyy-MM-dd"
      ),
      supplierId: data.supplierId,
      entryDate: this._datePipe.transform(
        new Date(data.entryDate),
        "yyyy-MM-dd"
      ),
      batchNumber: data.batchNumber,
      remarks: data.remarks,
      vatAmount: data.vatAmount,
      totalAmount: data.totalAmount,
      shippingCost: data.shippingCost,


    });
    this.setDetailData(data.purchaseDetail);
    this.calculateSummary();
  }
  setDetailData(data) {
    
    var i = 0;
    data.forEach((element) => {
      this.createDetail();
      this.productPurchaseDetailArray[i]
        .get("purchaseId")
        .patchValue(element.purchaseId),
        this.productPurchaseDetailArray[i].get("id").patchValue(element.id),
        this.productPurchaseDetailArray[i]
          .get("productId")
          .patchValue(element.productId),
          this.productPurchaseDetailArray[i]
          .get("unitId")
          .patchValue(element.unitId),
          this.productPurchaseDetailArray[i]
          .get("unitName")
          .patchValue(element.unitName),
        this.productPurchaseDetailArray[i]
          .get("quantity")
          .patchValue(element.quantity),
        this.productPurchaseDetailArray[i]
          .get("price")
          .patchValue(element.price),
        this.productPurchaseDetailArray[i]
          .get("remarks")
          .patchValue(element.remarks),
        i++;
    });
  }

  resetForm() {
    this.purchaseForm.reset();
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

  getProductPurchaseById(id) {
    this.purchaseService.getById(id).subscribe(
      (data) => {

        this.setDataToForm(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  addItemDetail(i) {
    // 
    // var lastLostQty =
    //   this.productPurchaseDetailArray[this.productPurchaseDetailArray.length - 1]
    //     .value.LostQty;
    // var lastFoundQty =
    //   this.productPurchaseDetailArray[this.productPurchaseDetailArray.length - 1]
    //     .value.FoundQty;
    // var lastItemId =
    //   this.productPurchaseDetailArray[this.productPurchaseDetailArray.length - 1]
    //     .value.ItemId;

    // if (!lastItemId) {
    //   return;
    // }

    this.createDetail();
  }
  addNewItem(data, i) {
    

    if (
      this.productPurchaseDetailArray.filter((c) => c.value.productId == data.id)
        .length > 1
    ) {
      this.alertService.error("This item is already added");

      this.productPurchaseDetailArray[i].get("productId").patchValue(null);
      this.productPurchaseDetailArray[i].get("quantity").patchValue(null);
      this.productPurchaseDetailArray[i].get("price").patchValue(null);
      this.productPurchaseDetailArray[i].get("unitId").patchValue(null);
      this.productPurchaseDetailArray[i].get("unitName").patchValue(null);
      this.productPurchaseDetailArray[i].get("totalAmount").patchValue(null);

      return;
    }
    else {
      this.productPurchaseDetailArray[i].get("unitId").patchValue(data.purchaseUnitId);
      this.productPurchaseDetailArray[i].get("unitName").patchValue(data.purchaseUnitName);
      this.productPurchaseDetailArray[i].get("price").patchValue(data.purchasePrice);
      this.productPurchaseDetailArray[i].get("totalAmount").patchValue(0);
    }
  }

  removeItem(index: number) {
    (this.purchaseForm.get("purchaseDetail") as FormArray).removeAt(
      index
    );
  }
  calculateSummary() {


    var totalAmount = 0;
    var grandTotal = 0;
    this.productPurchaseDetailArray.forEach((element) => {
      var qty = element.get("quantity").value ?? 0;
      this.totalLostQty += qty;
      var price = element.get("price").value ?? 0;
      totalAmount = qty * price;
      grandTotal += totalAmount;
      element.get("totalAmount").patchValue(totalAmount);

    });
    this.purchaseForm.get("totalAmount").patchValue(grandTotal);
  }

  onSubmit() {
    if (!this.purchaseForm.valid) {
      this.alertService.error("Please provide valid information");
      return;
    }

    if (this.purchaseForm.value.id == 0) {
      this.purchaseService
        .createPurchase(this.purchaseForm.value)
        .subscribe(
          (data) => {
            // this.alertService.success("Purchase Saved Successfully");
            this.showAlert(this.alertType.createSuccessAlert);
            this._router.navigate(["purchase/index"]);
          },
          (err) => {
            console.log(err);
            // this.alertService.error("Purchase could not be Saved");
            this.showAlert(this.alertType.errorAlert);
          }
        );
    }
    else {
      
      this.purchaseService
        .updatePurchase(this.purchaseForm.value)
        .subscribe(
          (data) => {
            this.alertService.success("Purchase Saved Successfully");
            this._router.navigate(["purchase/index"]);
          },
          (err) => {
            console.log(err);
            this.alertService.error("Purchase could not be Saved");
          }
        );
    }
  }
  goToListPage() {
    this._location.back();
  }
  logValidationErrors(group: FormGroup = this.purchaseForm): void {
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
    group: FormGroup = this.purchaseForm
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
