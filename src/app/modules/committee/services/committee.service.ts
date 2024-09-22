import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class CommitteeService {
  onCommitteeCreated: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) {}

  baseUrl = environment.apiUrl;



  createCommitteeCategory(data): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + 'v1/CommitteeCategories/Save', data)
      .pipe(catchError(this.handleError));
  }
  createCommittee(data): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + 'Committees/Save', data)
      .pipe(catchError(this.handleError));
  }

  getExecutiveCommitteeById(Id: Number) {
    return this.httpClient.get<any>(`${environment.apiUrl}Committees/GetAlleById?id=${Id}`);
  }

  getExecutiveCommitteeList(type: string, year: string) {
    return this.httpClient.get<any>(
      `${environment.apiUrl}Committees/GetAll?committeeType=${type}&committeeYear=${year}`
    );
  }
  GetCommitteeMembers(memberNo) {
    return this.httpClient.get<any>(
      `${environment.apiUrl}v1/RegisterMembers/GetCommitteeMembers?memberShipNo=${memberNo}`
    );
  }

  getCommitteeCategoryPagination(page?, itemPerPage?, searchKey?) {
    let params = new HttpParams();

    if (searchKey != null) {
      params = params.append('PageParams.SearchKey', searchKey);
    }

    if (page != null && itemPerPage != null) {
      params = params.append('PageParams.PageNumber', page);
      params = params.append('PageParams.PageSize', itemPerPage);
    }

    return this.httpClient
      .get<any>(`${this.baseUrl}v1/CommitteeCategories/GetAll`, {
        params,
      })
      .pipe(map((response: any) => response));
  }
  deleteCommitteeCategory(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.baseUrl + 'v1/CommitteeCategories/Remove?id=' + id)
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
