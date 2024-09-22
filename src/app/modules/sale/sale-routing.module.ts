import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaleListComponent } from './pages/sale-list/sale-list.component';
import { SaleCreateComponent } from './pages/sale-create/sale-create.component';

const routes: Routes = [
  {
    path:'list',
    component:SaleListComponent
  },
  {
    path:'create',
    component:SaleCreateComponent
  },
  {
    path: 'edit/:id',
    component: SaleCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleRoutingModule { }
