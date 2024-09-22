import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_alert';
import { BankService } from '../../services/bank.service';
import { DesignationService } from '../../services/designation.service';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.scss'],
})
export class BankListComponent implements OnInit {

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  numberOfEntries: number;
  currentPage: number;
  pageSize: number;
  searchForm: FormGroup;
  searchKey: any;
  spin: boolean = false;
  hasData: boolean;
  bank: any[] = [];
  isSubmit: boolean;
  isCancel: boolean;
  kloading: boolean;
  idToDelete: any;
  editId: any;
  isOpenAction: number | null = null;
  swalOptions: SweetAlertOptions = {};
  isForDeleteId: number;
  isShowFilter: any = false;
  isFilter = false;

  constructor(
    private service: BankService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private alertService: AlertService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.pageSize = 10;
    this.currentPage = 1;
    this.createFilterForm();
    this.getBankList();
  
  }

  setNumberOfTableEntries(event: any) {
    this.pageSize = +event.target.value;
    this.getBankList();
  }
  resetFilterForm() {
    // this.searchForm.get('Year').patchValue('2024');
  }
  toggleFilter() {
    this.isShowFilter = !this.isShowFilter;
  }
  filterData() {
    this.searchKey = this.searchForm.value.searchKey;
    this.pageSize = this.searchForm.value.pageSize;
    this.getBankList();
  }

  onCancelButtonClick(){
    document.getElementById("close-button").click()
  }

  getBankList() {
    this.editId = null;

    this.service
      .getBankPagination(this.currentPage, this.pageSize, this.searchKey)
      .subscribe({
        next: (data: PaginatedResult<any[]>) => {
          this.bank = data.result;
          
          console.log(this.bank);
          if (data?.result?.length >
            0) {
            this.hasData = true;
          } else {
            this.hasData = false;
          }
          this.numberOfEntries = data?.pagination?.totalItems;
        },

        error: (err) => {
          this.hasData = false;
          console.log(err);
        },
      });
  }

  updatePageWiseTableData(event) {
    this.currentPage = event;
    this.getBankList();
  }

  careateOrEditModalPopUp(createOrUpdateModal, id?) {
    if (id) {
      this.editId = id;
    } else {
      this.editId = null;
    }
    this.modalService.open(createOrUpdateModal, { size: 'lg' });
  }

  toggleDropdown(index: number, event: MouseEvent): void {
    event.stopPropagation(); // Prevent the click event from bubbling up
    this.isOpenAction = this.isOpenAction === index ? null : index;
  }
    
  closeDropdown(): void {
    this.isOpenAction = null;
  }

  createFilterForm() {
    this.searchForm = this.fb.group({
      region: null,
      searchKey:null,
      pageSize:10
    });
  }

  reloadData() {
    this.currentPage = 1;
    this.getBankList();
  }

  getRegionListByCriteria(event) {
    this.pageSize = Number(event.pageSize);
    this.searchKey = event.searchKey;
    this.getBankList();
  }

  onCancelPopUp() {
    document.getElementById('close-button').click();
  }

  filterModalPopUp(advanceFilterModal) {
    this.modalService.open(advanceFilterModal, { size: 'lg' });
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
    
    this.service.deleteBank(this.isForDeleteId).subscribe(
      (data) => {
        this.alertService.success('Information Saved Successfully');
        this.getBankList();
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
