import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../env';

@Injectable({ providedIn: 'root' })
export class SalesHttpService {

    constructor(private httpClient: HttpClient) { }

    private saleUrl: string = `${CONFIG.backendUrl}sales`;

    public getAll(): Observable<any> {
        return this.httpClient.get<any>(`${this.saleUrl}/all`);
    }

    public paginate(query: string): Observable<any> {
        return this.httpClient.get<any>(`${this.saleUrl}/pagination${query}`);
    }

    public getOneById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.saleUrl}/one/${id}`);
    }

    public create(creation: any): Observable<any> {
        return this.httpClient.post<any>(`${this.saleUrl}/create`, creation);
    }

    public update(id: number, update: any): Observable<any> {
        return this.httpClient.put<any>(`${this.saleUrl}/one/update/${id}`, update);
    }

    public deleteMany(query: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.saleUrl}/many${query}`);
    }

    public getItemById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.saleUrl}/items/one/by-id/${id}`);
    }

    public getItemsBySaleId(saleId: number): Observable<any> {
        return this.httpClient.get<any>(`${this.saleUrl}/items/many/by-sale-id/${saleId}`);
    }
}