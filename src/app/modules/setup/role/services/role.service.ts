import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  onRoleCreated: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) {}

  baseUrl = environment.apiUrl;

  createRole(data): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + 'Administrator/Role', data)
      .pipe(catchError(this.handleError));
  }

  updateRole(data): Observable<any> {
    return this.httpClient
      .put<any>(this.baseUrl + 'Administrator/Role?id=' + data.id, data)
      .pipe(catchError(this.handleError));
  }

  getById(id): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + 'Administrator/RoleById?id=' + id)
      .pipe(catchError(this.handleError));
  }
  getAllRoles(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + 'Administrator/Role')
      .pipe(catchError(this.handleError));
  }
  deleteRole(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.baseUrl + 'Administrator/Role?id=' + id)
      .pipe(catchError(this.handleError));
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
