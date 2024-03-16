import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../env';

@Injectable({ providedIn: 'root' })
export class StatsHttpService {

    constructor(private httpClient: HttpClient) { }

    private statUrl: string = `${CONFIG.backendUrl}stats`;

    public getTurnover(query: string): Observable<any> {
        return this.httpClient.get<any>(`${this.statUrl}/turnover/${query}`);
    }
}