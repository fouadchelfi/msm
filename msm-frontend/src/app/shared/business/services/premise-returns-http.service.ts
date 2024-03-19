import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../env';

@Injectable({ providedIn: 'root' })
export class PremiseReturnsHttpService {

    constructor(private httpClient: HttpClient) { }

    private premisereturnUrl: string = `${CONFIG.backendUrl}premise-returns`;

    public getAll(): Observable<any> {
        return this.httpClient.get<any>(`${this.premisereturnUrl}/all`);
    }

    public paginate(query: string): Observable<any> {
        return this.httpClient.get<any>(`${this.premisereturnUrl}/pagination${query}`);
    }

    public getOneById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.premisereturnUrl}/one/${id}`);
    }

    public create(creation: any): Observable<any> {
        return this.httpClient.post<any>(`${this.premisereturnUrl}/create`, creation);
    }

    public update(id: number, update: any): Observable<any> {
        return this.httpClient.put<any>(`${this.premisereturnUrl}/one/update/${id}`, update);
    }

    public deleteMany(query: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.premisereturnUrl}/many${query}`);
    }

    public getItemById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.premisereturnUrl}/items/one/by-id/${id}`);
    }

    public getItemsByPremiseReturnId(premisereturnId: number): Observable<any> {
        return this.httpClient.get<any>(`${this.premisereturnUrl}/items/many/by-premise-return-id/${premisereturnId}`);
    }
}