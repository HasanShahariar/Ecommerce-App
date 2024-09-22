import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_alert';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent implements OnInit {
  numberOfEntries: number;
  currentPage: number;
  pageSize: number;
  searchForm: FormGroup;
  searchKey: any;
  spin: boolean = false;
  hasData: boolean;
  isSubmit: boolean;
  isCancel: boolean;
  kloading: boolean;
  idToDelete: any;
  editId: any;
  roles: any = [];

  constructor(
    private service: RoleService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.pageSize = 10;
    this.currentPage = 1;
    this.getUnitList();
    this.createFilterForm();
  }

  setNumberOfTableEntries(event: any) {
    this.pageSize = +event.target.value;
    this.getUnitList();
  }

  getUnitList() {
    this.editId = null;
    this.spin = true;
    this.editId = null;
    this.idToDelete = null;
    this.service.getAllRoles().subscribe({
      next: (data) => {
        console.log(data);
        this.roles = data;
        this.spin = false;

        if (data.length > 0) {
          this.hasData = true;
        }
      },

      error: (err) => {
        this.spin = false;
        console.log('spin=' + this.spin);
        this.hasData = false;
      },
    });
  }

  updatePageWiseTableData(event) {
    this.currentPage = event;
    this.getUnitList();
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
      region: null,
    });
  }

  reloadData() {
    this.currentPage = 1;
    this.getUnitList();
  }

  getRegionListByCriteria(event) {
    this.pageSize = Number(event.pageSize);
    this.searchKey = event.searchKey;
    this.getUnitList();
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

  deleteButtonClick() {
    this.service.deleteRole(this.idToDelete).subscribe(
      (data) => {
        this.alertService.success('Successfully Deleted');
        this.getUnitList();
      },
      (err) => {
        console.log(err);
        this.alertService.error('Delete failed');
      }
    );
  }
}
