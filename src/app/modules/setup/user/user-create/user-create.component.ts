import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertService } from 'src/app/_alert';
import { UserService } from '../services/user.service';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { RoleService } from 'src/app/_fake/services/role.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnInit {
  @Output() successFullCreateOrUpdate: EventEmitter<any> = new EventEmitter();
  @Output() cancelButtonClick: EventEmitter<any> = new EventEmitter();

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  userForm: FormGroup;
  @Input() id: number;
  users: any[] = [];
  passwordShow: boolean;
  matchPasswordShow: boolean;
  matched: boolean;
  selectedRoles = [];
  roleList: any;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private commonServiceService: CommonServiceService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
    private roleService: RoleService,
  ) {}

  ngOnInit() {
    console.log(this.id);
    this.createUserForm();
    this.getAllRoles()
    if (this.id > 0) {
      this.getUserById(this.id);
    }
   
  }

  getAllRoles(){
    this.roleService.getAllRole().subscribe(
      (data)=>{
        
        console.log(data);
        this.roleList = data;
      },
      (err)=>{
        console.log(err);
        
      }
    )
  }

  getUserById(id) {
    
    this.userService.getById(id).subscribe(
      (data) => {
        console.log(data);
        this.userForm.patchValue({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          userName: data.userName,
          userRoles: data.userRoles,
          code:data.code
        });
        this.selectedRoles = data.userRoles;
      },

      (err) => {
        console.log(err);
      }
    );
  }
  validationMessages = {
    firstName: {
      required: 'First name is required.',
    },
    lastName: {
      required: 'Last name is required.',
    },
    email: {
      pattern: 'Email is invalid.',
    },
    whatsAppNumber: {
      required: 'whatsApp Number is required.',
    },
    phoneNumber: {
      required: 'Phone Number is required.',
      pattern: 'Invalid phone number',
    },
    password: {
      required: 'Password is required.',
    },
    userName: {
      required: 'User name is required.',
    },
    confirmPassword: {
      required: 'Confirm Password is required.',
    },
    userRoles: {
      required: 'Confirm Password is required.',
    },
  };

  formError = {
    firstName: '',
    lastName: '',
    email: '',
    whatsAppNumber: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    userName: '',
  };

  createUserForm() {
    if (this.id > 0) {
      this.userForm = this.fb.group({
        id: 0,
        firstName: ['', Validators.required],
        lastName: [''],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
          ],
        ],
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.pattern(new RegExp('^(01)?[0-9]{9}$')),
          ],
        ],
        userName: ['', [Validators.required]],
        userRoles: [null, Validators.required],
      });
    } else {
      this.userForm = this.fb.group({
        id: 0,
        firstName: ['', Validators.required],
        lastName: [''],
        email: [
          '',
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.pattern(new RegExp('^(01)?[0-9]{9}$')),
          ],
        ],
        userName: ['', [Validators.required]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        userRoles: [null, Validators.required],
        code:''
      });
    }
  }

  setRoles(event) {
    var roles = [];
    if (event.length > 0) {
      event.forEach((role) => {
        roles.push(role.name);
      });
    }
    this.userForm.get('userRoles').patchValue(roles);
    console.log(roles);
  }

  setUserName(event) {
    this.userForm.get('userName').patchValue(event.target.value);
  }
  onSubmit() {
    

    if (this.userForm.invalid) {
      this.logValidationErrorsCeckingBeforeSubmit(this.userForm);
      this.alertService.error('Please Provide Valid Information.');
      console.log(this.formError);
      return;
    }
    var user = this.userForm.value;
    console.log(user);
    if (user.id > 0) {
      this.userService.updateUser(user).subscribe(
        (data) => {
          console.log(data);
          // this.alertService.success('Successfully Updated');
          this.showAlert(this.alertType.createSuccessAlert);
          this.successFullCreateOrUpdate.emit(data);
        },
        (err) => {
          console.log(err);
          this.alertService.error('Update Failed');
        }
      );
    } else {
      this.userService.createUser(user).subscribe(
        (data) => {
          console.log(data);

          // this.alertService.success('Successfully Created');
          this.showAlert(this.alertType.createSuccessAlert);
          this.successFullCreateOrUpdate.emit(data);
          this.userService.onUserCreated.next(data);
        },
        (err) => {
          console.log(err);
          this.alertService.error(err[0]);
        }
      );
    }
  }

  onCancel() {
    this.cancelButtonClick.emit(true);

    this.commonServiceService.onCancelButtonClicked.next(true);
  }
  logValidationErrors(group: FormGroup = this.userForm): void {
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
    group: FormGroup = this.userForm
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

  checkExist() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      const rmTypeCode = value.trim();
      var found = this.users.find(
        (c) => c.name.toLowerCase().trim() == value.toLowerCase().trim()
      );
      if (found) {
        return { checkExist: 'true' };
      } else {
        return null;
      }
    };
  }
  newPassordType() {
    this.passwordShow = this.passwordShow ? false : true;
  }

  matchPassordType() {
    this.matchPasswordShow = this.matchPasswordShow ? false : true;
  }
  checkMatching(event) {
    if (
      event.target.value == this.userForm.value.password ||
      event.target.value == ''
    ) {
      this.matched = true;
    } else {
      this.matched = false;
    }
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
