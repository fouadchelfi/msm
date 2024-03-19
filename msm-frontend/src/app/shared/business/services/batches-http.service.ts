import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../env';

@Injectable({ providedIn: 'root' })
export class BatchesHttpService {

    constructor(private httpClient: HttpClient) { }

    private batchUrl: string = `${CONFIG.backendUrl}batches`;

    public getAll(): Observable<any> {
        return this.httpClient.get<any>(`${this.batchUrl}/all`);
    }

    public paginate(query: string): Observable<any> {
        return this.httpClient.get<any>(`${this.batchUrl}/pagination${query}`);
    }

    public getOneById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.batchUrl}/one/${id}`);
    }

    public create(creation: any): Observable<any> {
        return this.httpClient.post<any>(`${this.batchUrl}/create`, creation);
    }

    public update(id: number, update: any): Observable<any> {
        return this.httpClient.put<any>(`${this.batchUrl}/one/update/${id}`, update);
    }

    public deleteMany(query: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.batchUrl}/many${query}`);
    }

    public getItemById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.batchUrl}/items/one/by-id/${id}`);
    }

    public getItemsByBatchId(batchId: number): Observable<any> {
        return this.httpClient.get<any>(`${this.batchUrl}/items/many/by-batch-id/${batchId}`);
    }

    public getIngredientById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.batchUrl}/ingredients/one/by-id/${id}`);
    }

    public getIngredientsByBatchId(batchId: number): Observable<any> {
        return this.httpClient.get<any>(`${this.batchUrl}/ingredients/many/by-batch-id/${batchId}`);
    }
}