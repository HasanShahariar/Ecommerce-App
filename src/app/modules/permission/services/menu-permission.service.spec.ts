/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MenuPermissionService } from './menu-permission.service';

describe('Service: MenuPermission', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuPermissionService]
    });
  });

  it('should ...', inject([MenuPermissionService], (service: MenuPermissionService) => {
    expect(service).toBeTruthy();
  }));
});
