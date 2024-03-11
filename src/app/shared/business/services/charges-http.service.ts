import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../env';

@Injectable({ providedIn: 'root' })
export class ChargesHttpService {

    constructor(private httpClient: HttpClient) { }

    private chargeUrl: string = `${CONFIG.backendUrl}charges`;

    public getAll(): Observable<any> {
        return this.httpClient.get<any>(`${this.chargeUrl}/all`);
    }

    public paginate(query: string): Observable<any> {
        return this.httpClient.get<any>(`${this.chargeUrl}/pagination${query}`);
    }

    public getOneById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.chargeUrl}/one/${id}`);
    }

    public create(creation: any): Observable<any> {
        return this.httpClient.post<any>(`${this.chargeUrl}/create`, creation);
    }

    public update(id: number, update: any): Observable<any> {
        return this.httpClient.put<any>(`${this.chargeUrl}/one/update/${id}`, update);
    }

    public deleteMany(query: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.chargeUrl}/many${query}`);
    }
}