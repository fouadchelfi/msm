import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../env';

@Injectable({ providedIn: 'root' })
export class AuthHttpService {

    constructor(private httpClient: HttpClient) { }

    private authUrl: string = `${CONFIG.backendUrl}auth`;

    public login(login: any): Observable<any> {
        return this.httpClient.post<any>(`${this.authUrl}/local/login`, login);
    }

}