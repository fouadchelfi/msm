import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponse } from '../common';
import { CONFIG } from '../../env';

@Injectable({ providedIn: 'root' })
export class UsersHttpService {

    constructor(private httpClient: HttpClient) { }

    private userUrl: string = `${CONFIG.backendUrl}users`;

    public count(): Observable<HttpResponse> {
        const requestUrl = `${this.userUrl}/Count`;
        return this.httpClient.get<HttpResponse>(requestUrl);
    }

    public getPaginated(query: string): Observable<HttpResponse> {
        const requestUrl = `${this.userUrl}/Pagination${query}`;
        return this.httpClient.get<HttpResponse>(requestUrl);
    }

    public getAll(): Observable<HttpResponse> {
        const requestUrl = `${this.userUrl}`;
        return this.httpClient.get<HttpResponse>(requestUrl);
    }

    public create(creation: any): Observable<HttpResponse> {
        return this.httpClient.post<HttpResponse>(`${this.userUrl}`, creation);
    }

    public getOneById(id: number): Observable<HttpResponse> {
        return this.httpClient.get<HttpResponse>(`${this.userUrl}/one/${id}`);
    }

    public update(id: number, update: any): Observable<HttpResponse> {
        return this.httpClient.put<HttpResponse>(`${this.userUrl}/${id}`, update);
    }

    public delete(id: number): Observable<HttpResponse> {
        return this.httpClient.delete<HttpResponse>(`${this.userUrl}/${id}`);
    }

    public changePassword(data: any): Observable<HttpResponse<any>> {
        return this.httpClient.put<HttpResponse<any>>(`${this.userUrl}/current/set-change-passord`, data);
    }

    public setPersonalInfos(data: any): Observable<HttpResponse<any>> {
        return this.httpClient.put<HttpResponse<any>>(`${this.userUrl}/current/set-personel-infos`, data);
    }

    public sendValidateDocument(data: any): Observable<HttpResponse<any>> {
        return this.httpClient.put<HttpResponse<any>>(`${this.userUrl}/current/send-validate-document`, data);
    }
}