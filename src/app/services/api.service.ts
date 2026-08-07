import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiEndpoint; // 'http://localhost:3000'

    constructor(
        private http: HttpClient,
    ) { }

    call(route: string, params = {}, method: 'get' | 'post' = 'get'): Observable<any> {
        if (method === 'post') {
            return this.http.post(`${this.apiUrl}${route}`, params);
        }

        return this.http.get(`${this.apiUrl}${route}`, { params: params });
    }
}