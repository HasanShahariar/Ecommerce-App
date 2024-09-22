import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_alert';
import { Router } from '@angular/router';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss']
})
export class SaleListComponent implements OnInit {

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
  sale: any[] = [];
  isSubmit: boolean;
  isCancel: boolean;
  kloading: boolean;
  idToDelete: any;
  editId: any;
  isOpenAction: number | null = null;
  swalOptions: SweetAlertOptions = {};
  isForDeleteId: number;

  constructor(
    private service: SaleService,
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
    this.getSaleList();
    this.createFilterForm();
  }
  toggleFilter() {
    this.isShowFilter = !this.isShowFilter;
  }

  setNumberOfTableEntries(event: any) {
    this.pageSize = +event.target.value;
    this.getSaleList();
  }


  getSaleList() {
    this.editId = null;
    this.spin = true;
    this.service
      .getSalePagination(this.currentPage, this.pageSize, this.searchKey)
      .subscribe({
        next: (data: PaginatedResult<any[]>) => {
          
          this.sale = data.result;
          this.spin = false;
          console.log(this.sale);
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
    this.getSaleList();
  }

  goToCreatePage() {
    this.router.navigate(['sale/create']);
  }
  filterData() {
    // 
    // this.searchKey = this.filterForm.value.searchKey;
    // this.pageSize = this.searchForm.value.pageSize;
    this.getSaleList();
  }

  
  goToEdit(Id) {
    this.router.navigate(['sale/edit/',Id]);
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
    this.getSaleList();
  }

  getRegionListByCriteria(event) {
    this.pageSize = Number(event.pageSize);
    this.searchKey = event.searchKey;
    this.getSaleList();
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
    this.service.deleteSale(this.isForDeleteId).subscribe(
      (data) => {
        this.alertService.success('Information Saved Successfully');
        this.getSaleList();
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
