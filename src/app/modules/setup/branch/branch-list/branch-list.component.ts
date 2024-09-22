import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_alert';
import { BranchServiceService } from '../../services/branch-service.service';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';


@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit {

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
  branch: any[] = [];
  isSubmit: boolean;
  isCancel: boolean;
  kloading: boolean;
  idToDelete: any;
  editId: any;
  swalOptions: SweetAlertOptions = {};
  isForDeleteId: number;
  isShowFilter: any = false;
  isFilter = false;
  isOpenAction: number | null = null;

  constructor(
    private service: BranchServiceService,
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
    this.getBranchList();

  }

  setNumberOfTableEntries(event: any) {
    this.pageSize = +event.target.value;
    this.getBranchList();
  }

  onCancelButtonClick(){
    document.getElementById("close-button").click()
  }

  getBranchList() {
    this.editId = null;
    this.spin = true;
    this.service
      .getBranchPagination(this.currentPage, this.pageSize, this.searchKey)
      .subscribe({
        next: (data: PaginatedResult<any[]>) => {
          
          this.branch = data.result;
          this.spin = false;
          console.log(this.branch);
          if (data?.result?.length >
            0) {
            this.hasData = true;
          } else {
            this.hasData = false;
          }
          this.numberOfEntries = data?.pagination?.totalItems;
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
    this.getBranchList();
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
    this.getBranchList();
  }
  toggleDropdown(index: number, event: MouseEvent): void {
    event.stopPropagation(); // Prevent the click event from bubbling up
    this.isOpenAction = this.isOpenAction === index ? null : index;
  }

  careateOrEditModalPopUp(createOrUpdateModal, id?) {
    if (id) {
      this.editId = id;
    } else {
      this.editId = null;
    }
    this.modalService.open(createOrUpdateModal, { size: 'lg' });
  }

  createFilterForm() {
    this.searchForm = this.fb.group({
      searchKey: null,
      pageSize:10
    });
  }

  reloadData() {
    this.currentPage = 1;
    this.getBranchList();
  }

  getRegionListByCriteria(event) {
    this.pageSize = Number(event.pageSize);
    this.searchKey = event.searchKey;
    this.getBranchList();
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
      
  closeDropdown(): void {
    this.isOpenAction = null;
  }

  triggerDelete() {
    this.service.deleteBranch(this.isForDeleteId).subscribe(
      (data) => {
        this.alertService.success('Information Saved Successfully');
        this.getBranchList();
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
