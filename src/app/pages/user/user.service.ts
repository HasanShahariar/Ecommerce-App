import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map, throwError } from 'rxjs';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  onManageChargeCreated: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) {}

  baseUrl = environment.apiUrl;
  getPagination(page?, itemPerPage?, searchKey?) {
    let params = new HttpParams();

    if (searchKey != null) {
      params = params.append('SearchKey', searchKey);
    }

    if (page != null && itemPerPage != null) {
      params = params.append('PageNumber', page);
      params = params.append('PageSize', itemPerPage);
      params = params.append('AppId', 'WEBAPP');
    }
    return this.httpClient
      .get<any>(`${this.baseUrl}Users/GetAllUsers`, {
        params,
      })
      .pipe(map((response: any) => response));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error: ', errorResponse.error);
    } else {
      console.error('Server Side error', errorResponse);
    }
    return throwError('There is a problem with the service');
  }
}
