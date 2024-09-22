import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseListComponent } from './pages/purchase-list/purchase-list.component';
import { PurchaseCreateComponent } from './pages/purchase-create/purchase-create.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CrudModule } from '../crud/crud.module';


@NgModule({
  declarations: [
    PurchaseListComponent,
    PurchaseCreateComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    CommonModule,
    SharedModule,
    NgbModule,
    // NgxMaterialTimepickerModule,
    DragDropModule,
    SharedModule,
    CrudModule,
    SweetAlert2Module.forChild(),
  ],
  providers: [DatePipe],
})
export class PurchaseModule { }
