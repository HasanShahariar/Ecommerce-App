import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionReportService {
  constructor(private http: HttpClient) {}

  exportSubscriptionDueList(): Observable<Blob> {
    let params = new HttpParams();
    return this.http.get(
      `${environment.apiUrl}v1/SubscriptionPayments/ExportSubscriptionDueList?reportType=PDF&reportName=SubscriptionDue`,
      {
        responseType: 'blob',
      }
    );
  }
  exportSubscriptionPaymentDetailReport(
    fromDate,
    toDate,
    membershipNo,
    year,
    quarter
  ): Observable<Blob> {
    let params = new HttpParams();

    if (fromDate) {
      params = params.set('FromDate', fromDate);
    }
    if (toDate) {
      params = params.set('ToDate', toDate);
    }
    if (membershipNo) {
      params = params.set('MembershipNo', membershipNo);
    }
    if (year) {
      params = params.set('Year', year);
    }
    if (quarter) {
      params = params.set('Quarter', quarter);
    }

    return this.http.get(
      `${environment.apiUrl}v1/SubscriptionPayments/ExportSubscriptionPaymentDetailReport`,
      {
        responseType: 'blob',
        params: params,
      }
    );
  }
  exportSubscriptionPaymentSummaryReport(
    fromDate,
    toDate,
    membershipNo,
    year
  ): Observable<Blob> {
    let params = new HttpParams();

    if (fromDate) {
      params = params.set('FromDate', fromDate);
    }
    if (toDate) {
      params = params.set('ToDate', toDate);
    }
    if (membershipNo) {
      params = params.set('MembershipNo', membershipNo);
    }
    if (year) {
      params = params.set('Year', year);
    }

    return this.http.get(
      `${environment.apiUrl}v1/SubscriptionPayments/ExportSubscriptionPaymentSummaryReport`,
      {
        responseType: 'blob',
        params: params,
      }
    );
  }
  exportUserWiseSubscriptionCollectionReport(
    fromDate,
    toDate
  ): Observable<Blob> {
    let params = new HttpParams();

    if (fromDate) {
      params = params.set('FromDate', fromDate);
    }
    if (toDate) {
      params = params.set('ToDate', toDate);
    }

    return this.http.get(
      `${environment.apiUrl}v1/SubscriptionPayments/ExportUserWiseSubscriptionCollectionReport`,
      {
        responseType: 'blob',
        params: params,
      }
    );
  }
  exportUserWiseSubscriptionCollectionDetailsReport(
    fromDate,
    toDate
  ): Observable<Blob> {
    let params = new HttpParams();

    if (fromDate) {
      params = params.set('FromDate', fromDate);
    }
    if (toDate) {
      params = params.set('ToDate', toDate);
    }

    return this.http.get(
      `${environment.apiUrl}v1/SubscriptionPayments/ExportUserWiseSubscriptionCollectionReportdetails`,
      {
        responseType: 'blob',
        params: params,
      }
    );
  }
  exportSubscriptionDueDetailReport(
    membershipNo,
    year,
    quarter
  ): Observable<Blob> {
    let params = new HttpParams();

    if (membershipNo) {
      params = params.set('MembershipNo', membershipNo);
    }
    if (year) {
      params = params.set('Year', year);
    }
    if (quarter) {
      params = params.set('Quarter', quarter);
    }

    return this.http.get(
      `${environment.apiUrl}v1/SubscriptionPayments/ExportSubscriptionDueDetailReport`,
      {
        responseType: 'blob',
        params: params,
      }
    );
  }
  exportSubscriptionDueSummaryReport(
    membershipNo,
    year,
    quarter
  ): Observable<Blob> {
    let params = new HttpParams();

    if (membershipNo) {
      params = params.set('MembershipNo', membershipNo);
    }
    if (year) {
      params = params.set('Year', year);
    }
    if (quarter) {
      params = params.set('Quarter', quarter);
    }

    return this.http.get(
      `${environment.apiUrl}v1/SubscriptionPayments/ExportSubscriptionDueSummaryReport`,
      {
        responseType: 'blob',
        params: params,
      }
    );
  }
}
