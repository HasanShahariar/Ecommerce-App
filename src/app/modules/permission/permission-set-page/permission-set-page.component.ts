import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/_alert';
import { RoleService } from '../../setup/role/services/role.service';
import { MenuPermissionService } from '../services/menu-permission.service';
import { UtilityFunctions } from 'src/app/shared/components/utilities/utility-funrions';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';

@Component({
  selector: 'app-permission-set-page',
  templateUrl: './permission-set-page.component.html',
  styleUrls: ['./permission-set-page.component.scss'],
})
export class PermissionSetPageComponent implements OnInit {
  @Input() permissionReturn: boolean;
  @Input() isReadonly: boolean;
  @Input() classroomPackageId: number;
  @Input() isForPackageSetPermission: boolean;
  @Output() updateFeaturesPermission: EventEmitter<any> = new EventEmitter();
  @Output() updateMenuPermission: EventEmitter<any> = new EventEmitter();

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  
  permissionForm: FormGroup;
  roles: any[] = new Array();
  checked = ([] = new Array());
  permissionChecked = ([] = new Array());
  permissionList: any;
  permitedList: any[] = new Array();
  featureChecked: any[] = new Array();
  list: any;
  permitedMenuList: any;
  menulist: any;
  roleName: any;
  collapsToggler: boolean = true;
  client: any;
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    //private permissionService: FeaturepermissionService,
    private alertify: AlertService,
    private menuPermissionService: MenuPermissionService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
  ) {}
  permissionTypes = [
    { id: 1, name: 'মেনু অনুমোদন' },
    { id: 2, name: 'ফিচার্স অনুমোদন' },
  ];
  validationMessages = {
    roleName: {
      required: 'Role is required.',
    },
    permissionType: {
      required: 'Permission type is required.',
    },
  };
  formError = {
    roleName: '',
    permissionType: '',
  };

  ngOnInit() {
    this.client = JSON.parse(localStorage.getItem('client'));
    console.log(this.client);
    this.getPermissionList();
    this.createPermissionForm();
    this.getRoles();
    this.getMenuList();
    if (this.classroomPackageId > 0) {
      this.getFeaturePermissonByPackageId(this.classroomPackageId);
    }
  }
  ngOnChanges() {
    if (this.classroomPackageId > 0) {
      this.getFeaturePermissonByPackageId(this.classroomPackageId);
    }
  }

  getRoles() {
    
    this.roleService.getAllRoles().subscribe((data) => {
      this.roles = data;
    });
  }

  createPermissionForm() {
    this.permissionForm = this.fb.group({
      id: '',
      roleName: ['', Validators.required],
      permissionType: 1,
    });
  }

  getPermissionByRole(event) {
    console.log(event);
    this.clearPage();
    this.roleName = null;
    if (event != undefined) {
      this.roleName = event.name;
      if (this.permissionForm.value.permissionType == 1) {
        this.getPermitedMenu(event.name);
      } else {
        this.getFeaturePermissonByRole(event.name);
      }
    }
  }
  getPermissionOnChangeType(event) {
    this.clearPage();
    if (event != undefined) {
      if (this.permissionForm.value.permissionType == 1) {
        if (this.classroomPackageId > 0) {
          this.getPermitedMenuByPackageId(this.classroomPackageId);
        } else {
          this.getPermitedMenu(this.roleName);
        }
      } else {
        if (this.classroomPackageId > 0) {
          this.getFeaturePermissonByPackageId(this.classroomPackageId);
        } else {
          this.getFeaturePermissonByRole(this.roleName);
        }
      }
    }
  }

  ////Menu permissions

  getMenuList() {
    this.menuPermissionService.getAllMenu().subscribe((data) => {
      this.menulist = data;
    });

    this.menuPermissionService.getTopMenu().subscribe((data) => {
      this.list = data;
      if (this.isForPackageSetPermission) {
        this.list = this.list.map((item) => {
          if (item.submenu && item.submenu.length > 0) {
            item.submenu = item.submenu.filter(
              (subitem) => subitem.id != 38 && subitem.id != 24
            );
          }
          return item;
        });
        this.list = this.list.filter(
          (item) => item.id != 7 && item.id != 39 && item.id != 21
        );
      }
    });
  }

  getPermitedMenu(roleName) {
    this.checked = [];
    if (roleName != undefined) {
      this.menuPermissionService
        .getPermitedMenuIdsByRoleName(roleName)
        .subscribe((menuIds: any[]) => {
          this.permitedMenuList = menuIds;
          console.log(menuIds);
          for (var id of menuIds) {
            this.checked[id] = true;
          }
        });
    }
  }

  getPermitedMenuByPackageId(packageId) {
    this.checked = [];
    if (packageId != undefined) {
      this.menuPermissionService
        .getPermitedMenuIdsByPackageId(packageId)
        .subscribe((menuIds: any[]) => {
          this.permitedMenuList = menuIds;
          for (var id of menuIds) {
            this.checked[id] = true;
          }
        });
    }
  }

  getFeaturePermissonByPackageId(packageId) {
    if (packageId != undefined) {
      // this.permissionService
      //   .getPermissionsByPackageId(packageId)
      //   .subscribe((data: any[]) => {
      //     this.checkAllFeatruesPermission(data);
      //     this.permitedList = [];
      //     this.permissionChecked = [];
      //     data.forEach((c) => {
      //       this.addToPermitedList(c);
      //     });
      //   });
    }
  }

  removeParent(menu) {
    var find = false;
    if (menu.menuId != null) {
      var parentMenu = this.menulist.find((x) => x.id == menu.menuId);
      if (parentMenu.submenu.length > 0) {
        for (var menu of parentMenu.submenu) {
          if (this.permitedMenuList.find((c) => c == menu.id) > 0) {
            find = true;
          }
        }
      }
      if (!find) {
        if (this.permitedMenuList.find((x) => x == menu.menuId) > 0) {
          const index = this.permitedMenuList.indexOf(menu.menuId);
          this.permitedMenuList.splice(index, 1);
        }
        this.checked[menu.menuId] = false;

        if (parentMenu != undefined) {
          this.removeParent(parentMenu);
        }
      }
    }
  }

  addParent(menu) {
    if (menu.menuId != null) {
      if (!(this.permitedMenuList.find((x) => x == menu.menuId) > 0)) {
        this.permitedMenuList.push(menu.menuId);
        this.checked[menu.menuId] = true;
      }
      var parentMenu = this.menulist.find((x) => x.id == menu.menuId);
      if (parentMenu != undefined) {
        this.addParent(parentMenu);
      }
    }
  }

  removeChild(menu) {
    if (menu.submenu != null && menu.submenu.length > 0) {
      for (var menu of menu.submenu) {
        if (this.permitedMenuList.find((x) => x == menu.id) > 0) {
          const index = this.permitedMenuList.indexOf(menu.id);
          this.permitedMenuList.splice(index, 1);
        }
        this.checked[menu.id] = false;
        this.removeChild(menu);
      }
    }
  }

  addChild(menu) {
    if (menu.submenu != null && menu.submenu.length > 0) {
      for (var menu of menu.submenu) {
        if (!(this.permitedMenuList.find((x) => x == menu.id) > 0)) {
          this.permitedMenuList.push(menu.id);
        }
        this.checked[menu.id] = true;
        this.addChild(menu);
      }
    }
  }

  selectMenu(menu, event) {
    if (event.target.checked) {
      this.checked[menu.id] = true;
      this.permitedMenuList.push(menu.id);
      this.addChild(menu);
      this.addParent(menu);
    } else {
      const index = this.permitedMenuList.indexOf(menu.id);
      this.permitedMenuList.splice(index, 1);
      this.checked[menu.id] = false;
      this.removeParent(menu);
      this.removeChild(menu);
    }
    // this.onReturnMenuPermission.emit(this.permitedMenuList);
  }

  ////Feature permissions

  getPermissionList() {
    // this.permissionService.getAllPermissions().subscribe((data) => {
    //   this.permissionList = data;
    //   if (this.isForPackageSetPermission) {
    //     this.permissionList = this.permissionList.map((permission) => {
    //       permission.permissionFeatures = permission.permissionFeatures.filter(
    //         (p) => p.code != 'FAQ'
    //       );
    //       return permission;
    //     });
    //     this.permissionList = this.permissionList.filter(
    //       (permission) =>
    //         permission.code != 'User' &&
    //         permission.code != 'Category' &&
    //         permission.code != 'RentaClassroom'
    //     );
    //   }
    // });
  }

  getFeaturePermissonByRole(roleName) {
    if (roleName != undefined) {
      // this.permissionService
      //   .getPermissionsByRoleName(roleName)
      //   .subscribe((data: any[]) => {
      //     this.checkAllFeatruesPermission(data);
      //     this.permitedList = [];
      //     this.permissionChecked = [];
      //     data.forEach((c) => {
      //       // this.addToPermitedList(c.id, c.limit, c.relationId);
      //       this.addToPermitedList(c);
      //     });
      //   });
    }
  }

  checkAllFeatruesPermission(data) {
    this.permissionList.forEach((module) => {
      module.permissionFeatures.forEach((feature) => {
        var allPermission = true;
        feature.permissions.forEach((permission) => {
          if (!data.find((c) => c.id == permission.id)) {
            allPermission = false;
          }
        });
        if (allPermission) {
          this.featureChecked[feature.id] = true;
        }
      });
    });
  }

  addToPermitedList(permission) {
    this.permissionChecked[permission.id] = true;
    var permissionData = {
      id: permission.relationId,
      permissionId: permission.id,
      limit: Number(permission.limit),
    };
    // <HTMLInputElement>document.getElementById("dsjkf").value=3894
    if (permission.limit != null && permission.hasLimit) {
      document
        .getElementById(permission.id)
        .setAttribute('value', permission.limit);
    }

    this.permitedList.push(permissionData);
    // this.onUpdateFeaturesPermission.emit(this.permitedList);
  }

  selectPermission(permission, event, id) {
    var limit = null;
    if (permission.hasLimit) {
      limit = (<HTMLInputElement>document.getElementById(id)).value;
    }

    var relationId = 0;
    if (permission.relationId > 0) {
      relationId = permission.relationId;
    }
    var newpermission = {
      id: permission.id,
      limit: limit,
      relationId: relationId,
      hasLimit: permission.hasLimit,
    };
    if (event.target.checked) {
      this.addToPermitedList(newpermission);
      // this.addChild(menu);
      // this.addParent(menu);
    } else {
      var existingItem = this.permitedList.find(
        (c) => c.permissionId == permission.id
      );
      const index = this.permitedList.indexOf(existingItem);
      this.permitedList.splice(index, 1);
      this.permissionChecked[permission.id] = false;
      // this.onUpdateFeaturesPermission.emit(this.permitedList);
      // this.removeParent(menu);
      // this.removeChild(menu);
    }
  }

  changePermissionLimit(event, permissionId) {
    var existingItem = this.permitedList.find(
      (c) => c.permissionId == permissionId
    );
    if (existingItem) {
      const index = this.permitedList.indexOf(existingItem);
      this.permitedList[index].limit = Number(event.target.value);
    }
    // this.removeParent(menu);
    // this.removeChild(menu);
  }

  selectFeatureAllPermission(feature, event) {
    if (event.target.checked) {
      this.featureChecked[feature.id] = true;
      var i = 0;
      feature.permissions.forEach((permission) => {
        if (this.permitedList.find((c) => c.permissionId == permission.id)) {
        } else {
          var limit = null;
          if (permission.hasLimit) {
            limit = (<HTMLInputElement>document.getElementById(permission.id))
              .value;
          }
          var permissionData = {
            id: 0,
            permissionId: permission.id,
            limit: Number(limit),
          };
          this.permissionChecked[permission.id] = true;
          this.permitedList.push(permissionData);
        }
        i++;
      });

      // this.addChild(menu);
      // this.addParent(menu);
    } else {
      feature.permissions.forEach((permission) => {
        var item = this.permitedList.find(
          (c) => c.permissionId == permission.id
        );
        if (item) {
          const index = this.permitedList.indexOf(item);
          this.permitedList.splice(index, 1);
          this.permissionChecked[permission.id] = false;
        } else {
        }
      });
      // this.removeParent(menu);
      // this.removeChild(menu);
    }
  }

  updatePermission() {
    
    if (this.permissionForm.invalid) {
      this.logValidationErrorsCeckingBeforeSubmit(this.permissionForm);
      this.alertify.error('Please provide required value.');
      return;
    }

    var role = this.permissionForm.value.roleName;
    this.updateRoleMenuPermission(role);
    // if (this.permissionForm.value.permissionType == 1) {
    //   if (this.classroomPackageId > 0) {
    //     this.updatePackageMenuPermission();
    //   } else {
    //     this.updateRoleMenuPermission(role);
    //   }
    // } else {
    //   if (this.classroomPackageId > 0) {
    //     this.updatePackageFeaturePermission();
    //   } else {
    //     this.updateRoleFeaturePermission(role);
    //   }
    // }
  }

  updateRoleFeaturePermission(role) {
    // this.permissionService.updatePermission(role, this.permitedList).subscribe(
    //   (data) => {
    //     this.alertify.success('Succesfully updated');
    //     this.clearPage();
    //     this.permissionForm.patchValue({
    //       roleName: '',
    //     });
    //   },
    //   (err) => {
    //     console.log(err), this.alertify.error('Could not be updated.');
    //   }
    // );
  }

  updateRoleMenuPermission(role) {
    
    var value = { roleName: role, menuIds: this.permitedMenuList };
    this.menuPermissionService.updatePermission(value).subscribe(
      (data) => {
        this.showAlert(this.alertType.createSuccessAlert)
        this.permissionForm.patchValue({
          roleName: '',
        });
      },
      (err) => this.showAlert(this.alertType.errorAlert)
    );
  }
  updatePackageFeaturePermission() {
    // this.permissionService
    //   .updatePackageFeaturePermission(
    //     this.classroomPackageId,
    //     this.permitedList
    //   )
    //   .subscribe(
    //     (data) => {
    //       this.alertify.success('Succesfully updated');
    //       this.permissionForm.get('permissionType').patchValue(1);
    //       this.getPermissionOnChangeType(2);
    //       UtilityFunctions.goTop();
    //       this.onUpdateFeaturesPermission.emit(true);
    //     },
    //     (err) => {
    //       console.log(err), this.alertify.error('Could not be updated.');
    //     }
    //   );
  }
  updatePackageMenuPermission() {
    var value = {
      classroomPackageId: this.classroomPackageId,
      menuIds: this.permitedMenuList,
    };
    this.menuPermissionService.updatePackageMenuPermission(value).subscribe(
      (data) => {
        // this.alertify.success('Permission updated successfully.');
        this.showAlert(this.alertType.createSuccessAlert);
        this.permissionForm.get('permissionType').patchValue(2);
        this.getPermissionOnChangeType(2);
        UtilityFunctions.goTop();
        this.updateMenuPermission.emit(true);
      },
      (err) =>    this.showAlert(this.alertType.errorAlert)
    );
  }

  clearPage() {
    this.featureChecked = [];
    this.permissionChecked = [];
    this.permitedList = [];

    this.permitedMenuList = [];
    this.checked = [];
  }

  logValidationErrors(group: FormGroup = this.permissionForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formError[key] = '';
      if (
        abstractControl &&
        !abstractControl.valid &&
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
    group: FormGroup = this.permissionForm
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
  collapse(id) {
    var index = document.getElementsByClassName('disc-' + id);
    for (var i = 0; i < index.length; i++) {
      var ite = index[i];
      ite.setAttribute('style', 'display:none;');
    }

    if (this.collapsToggler) {
      this.collapsToggler = false;
    } else {
      this.collapsToggler = true;
    }
  }
  collapse2(id) {
    var index = document.getElementsByClassName('disc-' + id);
    for (var i = 0; i < index.length; i++) {
      var ite = index[i];
      ite.setAttribute('style', 'display:block;margin-left:40px');
    }

    if (this.collapsToggler) {
      this.collapsToggler = false;
    } else {
      this.collapsToggler = true;
    }
  }
  showAlert(swalOptions: SweetAlertOptions) {
    this.alertType.setAlertTypeText('Permission');
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
