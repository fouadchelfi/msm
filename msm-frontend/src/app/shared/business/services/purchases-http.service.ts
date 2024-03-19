import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../env';

@Injectable({ providedIn: 'root' })
export class PurchasesHttpService {

    constructor(private httpClient: HttpClient) { }

    private purchaseUrl: string = `${CONFIG.backendUrl}purchases`;

    public getAll(): Observable<any> {
        return this.httpClient.get<any>(`${this.purchaseUrl}/all`);
    }

    public paginate(query: string): Observable<any> {
        return this.httpClient.get<any>(`${this.purchaseUrl}/pagination${query}`);
    }

    public getOneById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.purchaseUrl}/one/${id}`);
    }

    public create(creation: any): Observable<any> {
        return this.httpClient.post<any>(`${this.purchaseUrl}/create`, creation);
    }

    public update(id: number, update: any): Observable<any> {
        return this.httpClient.put<any>(`${this.purchaseUrl}/one/update/${id}`, update);
    }

    public deleteMany(query: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.purchaseUrl}/many${query}`);
    }

    public getItemById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.purchaseUrl}/items/one/by-id/${id}`);
    }

    public getItemsByPurchaseId(purchaseId: number): Observable<any> {
        return this.httpClient.get<any>(`${this.purchaseUrl}/items/many/by-purchase-id/${purchaseId}`);
    }
}