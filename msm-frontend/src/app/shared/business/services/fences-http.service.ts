import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../env';

@Injectable({ providedIn: 'root' })
export class FencesHttpService {

    constructor(private httpClient: HttpClient) { }

    private fenceUrl: string = `${CONFIG.backendUrl}fences`;

    public getAll(): Observable<any> {
        return this.httpClient.get<any>(`${this.fenceUrl}/all`);
    }

    public paginate(query: string): Observable<any> {
        return this.httpClient.get<any>(`${this.fenceUrl}/pagination${query}`);
    }

    public getOneById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.fenceUrl}/one/${id}`);
    }

    public create(creation: any): Observable<any> {
        return this.httpClient.post<any>(`${this.fenceUrl}/create`, creation);
    }

    public update(id: number, update: any): Observable<any> {
        return this.httpClient.put<any>(`${this.fenceUrl}/one/update/${id}`, update);
    }

    public deleteMany(query: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.fenceUrl}/many${query}`);
    }


    public getCustomersSalesTotalAmount(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.fenceUrl}/sales/customers/total/${id}`);
    }

    public getPremisesSalesTotalAmount(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.fenceUrl}/sales/premises/total/${id}`);
    }

    public getBatchesTotalAmount(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.fenceUrl}/batches/total/${id}`);
    }

    public getPurchasesTotalCost(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.fenceUrl}/purchases/total/${id}`);
    }
    public getStocksTotalQuantity(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.fenceUrl}/stocks/total-quantity/${id}`);
    }
    public getStocksTotalAmount(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.fenceUrl}/stocks/total-amount/${id}`);
    }
    public getChargesTotalAmount(): Observable<any> {
        return this.httpClient.get<any>(`${this.fenceUrl}/charges/total`);
    }
    public getLossesTotalAmount(): Observable<any> {
        return this.httpClient.get<any>(`${this.fenceUrl}/losses/total`);
    }
    public getEmployeesTotalPayments(): Observable<any> {
        return this.httpClient.get<any>(`${this.fenceUrl}/employees-payments/total`);
    }
    public getEmployeesTotalDebts(): Observable<any> {
        return this.httpClient.get<any>(`${this.fenceUrl}/employees-debts/total`);
    }
    public getSuppliersTotalDebts(): Observable<any> {
        return this.httpClient.get<any>(`${this.fenceUrl}/suppliers-debts/total`);
    }
    public getCustomersTotalDebts(): Observable<any> {
        return this.httpClient.get<any>(`${this.fenceUrl}/customers-debts/total`);
    }
}