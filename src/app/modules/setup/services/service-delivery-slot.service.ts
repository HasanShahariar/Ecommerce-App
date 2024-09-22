import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { PaginatedResult } from 'src/app/shared/model/pagination.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ServiceDeliverySlotService {

  constructor(
    private httpClient: HttpClient
  ) { }

  baseUrl = environment.apiUrl;

  // getDeliverySlotList(): Observable<any[]> {
  //   return this.httpClient
  //     .get<any>(this.baseUrl + 'deliverySlots')
  //     .pipe(catchError(this.handleError));
  // }


  getDeliverySlotList(page?, itemPerPage?, searchKey?,categoryId?,criteria?) {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();
    

    // if (isActive != null) {

    //   params = params.append('IsActive', isActive);
    // }
    // if (categoryId != null) {

    //   params = params.append('categoryId', categoryId);
    // }
    if(criteria){
      if (criteria.fromStartTime != null) {
        params = params.append('FromStartTime', criteria.fromStartTime);
      }
      if (criteria.toStartTime != null) {
        params = params.append('ToStartTime', criteria.toStartTime);
      }
      if (criteria.fromEndTime != null) {
        params = params.append('FromEndTime', criteria.fromEndTime);
      }
      if (criteria.toEndTime != null) {
        params = params.append('ToEndTime', criteria.toEndTime);
      }
      if (criteria.status != null) {
        params = params.append('IsActive', criteria.fromEndTime);
      }
    }

    

    if (searchKey != null) {
      params = params.append('PageParams.SearchKey', searchKey);
    }

    if (page != null && itemPerPage != null) {
      params = params.append('PageParams.PageNumber', page);
      params = params.append('PageParams.PageSize', itemPerPage);
    }

    return this.httpClient
      .get<any[]>(this.baseUrl + 'deliverySlots', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );
  }

  updateDeliverySlotOrder( faq: any): Observable<any> {
    return this.httpClient
      .put<any>(this.baseUrl + 'deliverySlots/updateDisplayOrder', faq)
      .pipe(catchError(this.handleError));
  }
  
  getDeliverySlotBySlotId(id): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + 'deliveryslots/' + id)
      .pipe(catchError(this.handleError));
  }

  createDeliverySlot(messageDto: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + 'deliverySlots', messageDto)
      .pipe(catchError(this.handleError));
  }

  updateDeliverySlot(messageDto: any): Observable<any> {
    return this.httpClient
      .put<any>(this.baseUrl + 'deliverySlots', messageDto)
      .pipe(catchError(this.handleError));
  }

  deleteDeliverySlot(id: number): Observable<void> {
    console.log(id);
    return this.httpClient
      .delete<void>(this.baseUrl + 'deliverySlots/' + id)
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
