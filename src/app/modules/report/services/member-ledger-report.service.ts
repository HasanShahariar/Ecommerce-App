import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MemberLedgerReportService {
  constructor(private http: HttpClient) {}

  getMemberInfoByMemberShipNo(memberShipNo: string) {
    return this.http
      .get<Response>(
        `${environment.apiUrl}v1/RegisterMembers/GetByMemberShipNo?memberShipNo=${memberShipNo}`
      )
      .pipe(map((response: any) => response.Data));
  }
  getMemberAttendanceReport(fromDate, toDate, MembershipNo?): Observable<Blob> {
    let params = new HttpParams();

    params = params.set('FromDate', fromDate);
    params = params.set('ToDate', toDate);
    if (fromDate) {
      params = params.set('FromDate', fromDate);
    }
    if (toDate) {
      params = params.set('ToDate', toDate);
    }
    if (MembershipNo) {
      params = params.set('MembershipNo', MembershipNo);
    }

    return this.http.get(
      `${environment.apiUrl}v1/MemberReport/GetMemberAttendance`,
      {
        responseType: 'blob',
        params: params,
      }
    );
  }
}
