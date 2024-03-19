import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../env';

@Injectable({ providedIn: 'root' })
export class StocksHttpService {

    constructor(private httpClient: HttpClient) { }

    private stockUrl: string = `${CONFIG.backendUrl}stocks`;

    public getAll(): Observable<any> {
        return this.httpClient.get<any>(`${this.stockUrl}/all`);
    }

    public paginate(query: string): Observable<any> {
        return this.httpClient.get<any>(`${this.stockUrl}/pagination${query}`);
    }

    public getOneById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.stockUrl}/one/${id}`);
    }

    public create(creation: any): Observable<any> {
        return this.httpClient.post<any>(`${this.stockUrl}/create`, creation);
    }

    public update(id: number, update: any): Observable<any> {
        return this.httpClient.put<any>(`${this.stockUrl}/one/update/${id}`, update);
    }

    public deleteMany(query: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.stockUrl}/many${query}`);
    }

    public getStocksByStatus(status: string): Observable<any> {
        return this.httpClient.get<any>(`${this.stockUrl}/many/by-status/${status}`);
    }

    public getFrozenStockByStockId(stockId: number): Observable<any> {
        return this.httpClient.get<any>(`${this.stockUrl}/one/frozen/${stockId}`);
    }
}