import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleRoutingModule } from './sale-routing.module';
import { SaleListComponent } from './pages/sale-list/sale-list.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CrudModule } from '../crud/crud.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SaleCreateComponent } from './pages/sale-create/sale-create.component';


@NgModule({
  declarations: [
    SaleListComponent,
    SaleCreateComponent
  ],
  imports: [
    CommonModule,
    SaleRoutingModule,
    SharedModule,
    CrudModule,
    SweetAlert2Module.forChild(),
  ]
})
export class SaleModule { }
