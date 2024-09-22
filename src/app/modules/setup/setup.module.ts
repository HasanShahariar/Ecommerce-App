import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupRoutingModule } from './setup-routing.module';
import { UnitCreateComponent } from './unit/components/unit-create/unit-create.component';
import { UnitIndexComponent } from './unit/pages/unit-index/unit-index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BankListComponent } from './bank/bank-list/bank-list.component';
import { BankCreateComponent } from './bank/bank-create/bank-create.component';
import { RoleListComponent } from './role/role-list/role-list.component';
import { RoleCreateComponent } from './role/role-create/role-create.component';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BranchCreateComponent } from './branch/branch-create/branch-create.component';
import { BranchListComponent } from './branch/branch-list/branch-list.component';
import { SupplierListComponent } from './supplier/supplier-list/supplier-list.component';
import { SupplierCreateComponent } from './supplier/supplier-create/supplier-create.component';
import { ItemTypeCreateComponent } from './item-type/item-type-create/item-type-create.component';
import { ItemTypeListComponent } from './item-type/item-type-list/item-type-list.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductCreateComponent } from './product/product-create/product-create.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CrudModule } from '../crud/crud.module';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerCreateComponent } from './customer/customer-create/customer-create.component';

@NgModule({
  declarations: [
    UnitCreateComponent,
    UnitIndexComponent,
    BankListComponent,
    BankCreateComponent,
    RoleListComponent,
    RoleCreateComponent,
    UserCreateComponent,
    UserListComponent,
    BranchCreateComponent,
    BranchListComponent,
    SupplierListComponent,
    SupplierCreateComponent,
    ItemTypeCreateComponent,
    ItemTypeListComponent,
    ProductListComponent,
    ProductCreateComponent,
    CustomerListComponent,
    CustomerCreateComponent
  ],
  imports: [
    CommonModule,
    SetupRoutingModule,
    SharedModule,
    NgbModule,
    DragDropModule,
    SharedModule,
    CrudModule,
    SweetAlert2Module.forChild(),
  ],
})
export class SetupModule {}
