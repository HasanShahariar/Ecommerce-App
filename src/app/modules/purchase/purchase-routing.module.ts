import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseListComponent } from './pages/purchase-list/purchase-list.component';
import { PurchaseCreateComponent } from './pages/purchase-create/purchase-create.component';

const routes: Routes = [
  {
    path: 'index',
    component: PurchaseListComponent,
  },
  {
    path: 'create',
    component: PurchaseCreateComponent,
  },
  {
    path: 'edit/:id',
    component: PurchaseCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
