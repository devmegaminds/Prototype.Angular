import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ParentDataMappingService {

  constructor(private http: HttpClient) { }


  getparentJsonData(): Observable<any> {

    return this.http.get(`${environment.WebApiURL}api/ManageParent/GetParentlist`).pipe(
      map((response: any) => {
        return response.stParentObject
      }));
  }

  updateParentProperty(data: any): Observable<any> {
    const headers = {
      'Content-Type': 'application/json'
    }
    let body = {
      samplingTime: data.SamplingTime,
      properties: JSON.stringify(data.Properties).replace(/"/g, "'"),
      stFilePath: '',
    };
    return this.http.post(`${environment.WebApiURL}api/ManageParent/UpdateParentList`, body, { headers }).pipe(map((response: any) => {
      return response
    }));
  }
}