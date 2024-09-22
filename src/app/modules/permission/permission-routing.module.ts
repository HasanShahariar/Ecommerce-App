import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionSetPageComponent } from './permission-set-page/permission-set-page.component';

const routes: Routes = [
  {
    path: 'manage',
    component: PermissionSetPageComponent,
    //data: { breadcrumbs: 'Permission Manage' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermissionRoutingModule {}
