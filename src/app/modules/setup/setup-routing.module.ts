import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankListComponent } from './bank/bank-list/bank-list.component';
import { RoleListComponent } from './role/role-list/role-list.component';
import { UnitIndexComponent } from './unit/pages/unit-index/unit-index.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { BranchListComponent } from './branch/branch-list/branch-list.component';
import { SupplierListComponent } from './supplier/supplier-list/supplier-list.component';
import { ItemTypeListComponent } from './item-type/item-type-list/item-type-list.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { ProductCreateComponent } from './product/product-create/product-create.component';

const routes: Routes = [
  {
    path: 'role/index',
    component: RoleListComponent,
  },
  {
    path: 'user/index',
    component: UserListComponent,
  },
  {
    path: 'item-type/index',
    component: ItemTypeListComponent,
  },

  {
    path: 'supplier/index',
    component: SupplierListComponent,
  },
  {
    path: 'customer/list',
    component: CustomerListComponent,
  },
  {
    path: 'unit/index',
    component: UnitIndexComponent,
  },
  {
    path: 'product/index',
    component: ProductListComponent,
  },
  {
    path: 'product/create',
    component: ProductCreateComponent,
  },
  {
    path: 'edit/:id',
    component: ProductCreateComponent,
  },
 
  {
    path: 'bank/index',
    component: BankListComponent,
  },
  {
    path: 'branch/index',
    component: BranchListComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
