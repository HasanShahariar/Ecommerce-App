import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventTicketReportService {
  constructor(private http: HttpClient) {}

  getEventTicketReport(fromDate, toDate, eventId): Observable<Blob> {
    let params = new HttpParams();

    params = params.set('FromDate', fromDate);
    params = params.set('ToDate', toDate);
    params = params.set('EventId', eventId);

    return this.http.get(
      `${environment.apiUrl}v1/TicketReport/EventTicketReport`,
      {
        responseType: 'blob',
        params: params,
      }
    );
  }

  getMemServicesList(page?, itemPerPage?, searchKey?) {
    let params = new HttpParams();

    if (searchKey != null) {
      params = params.append('PageParams.SearchKey', searchKey);
    }

    if (page != null && itemPerPage != null) {
      params = params.append('PageParams.PageNumber', 1);
      params = params.append('PageParams.PageSize', 1000);
    }

    return this.http
      .get<any>(`${environment.apiUrl}v1/MemServices/GetAll`, {
        params,
      })
      .pipe(map((response: any) => response));
  }
  getEventTicketSaleReport(eventId, membershipNo): Observable<Blob> {
    return this.http.get(
      `${environment.apiUrl}v1/EventTicketSaleReport/EventTicketSaleReport?EventId=${eventId}&MembershipNo=${membershipNo}`,
      {
        responseType: 'blob',
      }
    );
  }
}
