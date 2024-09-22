import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_alert';
import { PurchaseService } from '../../services/purchase.service';
import { Router } from '@angular/router';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent implements OnInit {

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  isShowFilter: any = false;
  isFilter = true;

  numberOfEntries: number;
  currentPage: number;
  pageSize: number;
  searchForm: FormGroup;
  searchKey: any;
  spin: boolean = false;
  hasData: boolean;
  purchase: any[] = [];
  isSubmit: boolean;
  isCancel: boolean;
  kloading: boolean;
  idToDelete: any;
  editId: any;
  isOpenAction: number | null = null;
  swalOptions: SweetAlertOptions = {};
  isForDeleteId: number;

  constructor(
    private service: PurchaseService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.pageSize = 10;
    this.currentPage = 1;
    this.getPurchaseList();
    this.createFilterForm();
  }
  toggleFilter() {
    this.isShowFilter = !this.isShowFilter;
  }

  setNumberOfTableEntries(event: any) {
    this.pageSize = +event.target.value;
    this.getPurchaseList();
  }


  getPurchaseList() {
    this.editId = null;
    this.spin = true;
    this.service
      .getPurchasePagination(this.currentPage, this.pageSize, this.searchKey)
      .subscribe({
        next: (data: PaginatedResult<any[]>) => {
          
          this.purchase = data.result;
          this.spin = false;
          console.log(this.purchase);
          if (data?.result?.length >
            0) {
            this.hasData = true;
          } else {
            this.hasData = false;
          }
          this.numberOfEntries = data.pagination.totalItems;
        },

        error: (err) => {
          this.spin = false;
          this.hasData = false;
          console.log(err);
        },
      });
  }

  updatePageWiseTableData(event) {
    this.currentPage = event;
    this.getPurchaseList();
  }

  goToCreatePage() {
    this.router.navigate(['purchase/create']);
  }
  filterData() {
    // 
    // this.searchKey = this.filterForm.value.searchKey;
    // this.pageSize = this.searchForm.value.pageSize;
    this.getPurchaseList();
  }

  
  goToEdit(Id) {
    this.router.navigate(['purchase/edit/',Id]);
  }

  closeDropdown(): void {
    this.isOpenAction = null;
  }

  createFilterForm() {
    this.searchForm = this.fb.group({
      pageSize:10,
      searchKey:''
    });
  }

  reloadData() {
    this.currentPage = 1;
    this.getPurchaseList();
  }

  getRegionListByCriteria(event) {
    this.pageSize = Number(event.pageSize);
    this.searchKey = event.searchKey;
    this.getPurchaseList();
  }

  onCancelPopUp() {
    document.getElementById('close-button').click();
  }

  filterModalPopUp(advanceFilterModal) {
    this.modalService.open(advanceFilterModal, { size: 'lg' });
  }

  DeleteRegionPopUp(deleteConfirmation, id) {
    this.idToDelete = id;
    this.modalService.open(deleteConfirmation, { size: 'md' });
  }
  toggleDropdown(index: number, event: MouseEvent): void {
    event.stopPropagation(); // Prevent the click event from bubbling up
    this.isOpenAction = this.isOpenAction === index ? null : index;
  }

  resetFilterForm() {
    // this.searchForm.get('Year').patchValue('2024');
  }

  deleteButtonClick(id) {
    this.isForDeleteId = id;
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.showAlert(this.alertType.deleteSuccessAlert);
      }
    });
  }

  triggerDelete() {
    this.service.deletePurchase(this.isForDeleteId).subscribe(
      (data) => {
        this.alertService.success('Information Saved Successfully');
        this.getPurchaseList();
      },
      (err) => {
        console.log(err);
        this.alertService.error('Information Saved ');
      }
    );
  }

  showAlert(swalOptions: SweetAlertOptions) {
    this.alertType.setAlertTypeText('CommitteeCategory');
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
