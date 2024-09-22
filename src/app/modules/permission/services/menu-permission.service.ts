import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuPermissionService {
  onUpdateMenuPermission: Subject<boolean> = new Subject<boolean>();
  constructor(private httpClient: HttpClient) {}
  client = JSON.parse(localStorage.getItem('client'));
  baseUrl = environment.apiUrl;

  getPermitedMenuByRoleName(roleName): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + 'Menu/getPermitedMenu/' + roleName)
      .pipe(catchError(this.handleError));
  }

  getPermtedMenuByUserId(userId): Observable<any> {
    return this.httpClient
      .get<any>(
        this.baseUrl +
          'PermissionManage/getPermitedMenuByUserId?userId=' +
          userId
      )
      .pipe(catchError(this.handleError));
  }

  getPermitedMenuIdsByRoleName(roleName): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + 'Menu/getPermitedMenuIds?roleName=' + roleName)
      .pipe(catchError(this.handleError));
  }

  getPermitedMenuIdsByPackageId(packageId): Observable<any> {
    return this.httpClient
      .get<any>(
        this.baseUrl + 'Menu/getPackagePermitedMenuIds?packageId=' + packageId
      )
      .pipe(catchError(this.handleError));
  }

  getAllMenu(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + 'Menu/getAll')
      .pipe(catchError(this.handleError));
  }
  getTopMenu(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + 'Menu/getTopMenu')
      .pipe(catchError(this.handleError));
  }

  updatePermission(value): Observable<any> {
    return this.httpClient
      .put<any>(this.baseUrl + 'Menu/menuPermission', value)
      .pipe(catchError(this.handleError));
  }

  updatePackageMenuPermission(value): Observable<any> {
    return this.httpClient
      .put<any>(this.baseUrl + 'Menu/packageMenuPermission', value)
      .pipe(catchError(this.handleError));
  }

  getPermitedMenuByRoles(roles: string[]): Observable<any> {
    
    let httpParams = new HttpParams();
    let index = 0;
    roles.forEach((role) => {
      httpParams = httpParams.append(
        'RoleNames[' + index++ +']',
        role.toString()
      );
    });
    var rolelist = { roleNames: roles };
    var fdd = this.httpClient
    .get<any>(this.baseUrl + 'Menu/getPermitedMenuByRoles', {
      params: httpParams,
    });
    
    return fdd

    // return this.httpClient
    // .get<any>(this.baseUrl + 'Menu/getPermitedMenuByRoles', {
    //   observe: 'response',
    //   httpParams,
    // })
    // .pipe(
    //   map((response) => {
    //     paginatedResult.result = response.body;
    //     if (response.headers.get('Pagination') != null) {
    //       paginatedResult.pagination = JSON.parse(
    //         response.headers.get('Pagination')
    //       );
    //     }
    //     return paginatedResult;
    //   })
    // );
  }

  // createCategory(category: Category): Observable<Category> {
  //   return this.httpClient
  //     .post<Category>(this.baseUrl + 'Category', category)
  //     .pipe(catchError(this.handleError));
  // }

  setCategoryCourseFeatured(categoryId, data: any[]): Observable<any> {
    return this.httpClient.put<any[]>(
      this.baseUrl + 'Category/featureCourseAddOrUpdate/' + categoryId,
      data
    );
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
