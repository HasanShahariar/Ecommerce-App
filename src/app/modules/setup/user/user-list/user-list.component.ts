import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_alert';
import { UserService } from '../services/user.service';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {

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
  userList: any[] = [];
  isSubmit: boolean;
  isCancel: boolean;
  kloading: boolean;
  idToDelete: any;
  editId: any;

  isOpenAction: number | null = null;
  swalOptions: SweetAlertOptions = {};
  isForDeleteId: number;
  isShowFilter: any = false;
  isFilter = true;

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private alertService: AlertService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.pageSize = 10;
    this.currentPage = 1;
    this.getUserList();
    this.createFilterForm();
  }

  setNumberOfTableEntries(event: any) {
    this.pageSize = +event.target.value;
    this.getUserList();
  }

  getUserList() {
    this.editId = null;

    this.userService
      .getUserPagination(this.currentPage, this.pageSize, this.searchKey)
      .subscribe({
        next: (data: PaginatedResult<any[]>) => {
          this.userList = data.result;
          console.log(data.result);
       
          if (data.result.length > 0) {
            this.hasData = true;
          } else {
            this.hasData = false;
          }
          this.numberOfEntries = data.pagination.totalItems;
        },

        error: (err) => {
  
          console.log('spin=' + this.spin);
          this.hasData = false;
        },
      });
  }

  updatePageWiseTableData(event) {
    this.currentPage = event;
    this.getUserList();
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
      searchKey: '',
      pageSize:10
    });
  }

  reloadData() {
    this.currentPage = 1;
    this.getUserList();
  }

  getRegionListByCriteria(event) {
    this.pageSize = Number(event.pageSize);
    this.searchKey = event.searchKey;
    this.getUserList();
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



  deleteButtonClick(id) {

    this.isForDeleteId = id;
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.showAlert(this.alertType.deleteSuccessAlert);
      }
    });
  }


  triggerDelete() {
    this.userService.deleteUser(this.idToDelete).subscribe(
      (data) => {
        this.alertService.success('Information Saved Successfully');
        this.getUserList();
      },
      (err) => {
        console.log(err);
        this.alertService.error('Information Saved ');
      }
    );
  }

  toggleDropdown(index: number, event: MouseEvent): void {
    event.stopPropagation(); // Prevent the click event from bubbling up
    this.isOpenAction = this.isOpenAction === index ? null : index;
  }

  closeDropdown(): void {
    this.isOpenAction = null;
  }
  resetFilterForm() {
    // this.searchForm.get('Year').patchValue('2024');
  }
  toggleFilter() {
    this.isShowFilter = !this.isShowFilter;
  }
  filterData() {
    // 
    // this.searchKey = this.filterForm.value.searchKey;
    // this.pageSize = this.searchForm.value.pageSize;
    this.getUserList();
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
