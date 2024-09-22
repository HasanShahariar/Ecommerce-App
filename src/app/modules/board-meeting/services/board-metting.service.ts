import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BoardMettingService {
  constructor(private http: HttpClient) {}

  getPagination(page?, itemPerPage?, searchKey?) {
    let params = new HttpParams();

    if (searchKey != null) {
      params = params.append('PageParams.SearchKey', searchKey);
    }

    if (page != null && itemPerPage != null) {
      params = params.append('PageParams.PageNumber', page);
      params = params.append('PageParams.PageSize', itemPerPage);
    }

    return this.http
      .get<any>(`${environment.apiUrl}v1/BoardMeetingMinuets/GetAll`, {
        params,
      })
      .pipe(map((response: any) => response));
  }
  getAllCommitee() {
    return this.http.get<any>(
      `${environment.apiUrl}Committees/GetCommitteeList`
    );
  }
  create(uploadFile: FormData) {
    return this.http.post<any>(
      `${environment.apiUrl}File/UploadBoardMeetingMinuet`,
      uploadFile
    );
  }
  delete(Id: number) {
    return this.http.delete<any>(
      `${environment.apiUrl}v1/BoardMeetingMinuets/Remove?id=${Id}`
    );
  }
}
