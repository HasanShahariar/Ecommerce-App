import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailLedgerReportService {
  constructor(private http: HttpClient) {}
  getMemberInfoByMemberShipNo(memberShipNo: string) {
    return this.http
      .get<Response>(
        `${environment.apiUrl}v1/RegisterMembers/GetByMemberShipNo?memberShipNo=${memberShipNo}`
      )
      .pipe(map((response: any) => response.Data));
  }
  getMemberLedgerDetailReport(fromDate, toDate, memberNo?): Observable<Blob> {
    let params = new HttpParams();

    params = params.set('FromDate', fromDate);
    params = params.set('ToDate', toDate);
    params = params.set('MembershipNo', memberNo);

    return this.http.get(
      `${environment.apiUrl}v1/MemberReport/GetMemberLedgerDetail`,
      {
        responseType: 'blob',
        params: params,
      }
    );
  }

  getMemberLedgerSummaryReport(fromDate, toDate, memberNo?): Observable<Blob> {
    let params = new HttpParams();

    params = params.set('FromDate', fromDate);
    params = params.set('ToDate', toDate);
    params = params.set('MembershipNo', memberNo);

    return this.http.get(
      `${environment.apiUrl}v1/MemberReport/GetMemberLedgerSummary`,
      {
        responseType: 'blob',
        params: params,
      }
    );
  }
  sendMail(id) {
    return this.http.post<Response>(
      `${environment.apiUrl}v1/RegisterMembers/SendMail`,
      id
    );
  }
}
