import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppDownloadService {
  constructor(private http: HttpClient) {}

  getAppDownloadReport(IsActive): Observable<Blob> {
    return this.http.get(
      `${environment.apiUrl}v1/AppDownload/GetAppDownloadReport?IsActive=${IsActive}`,
      {
        responseType: 'blob',
      }
    );
  }
}
