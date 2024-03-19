import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../env';

@Injectable({ providedIn: 'root' })
export class DistributionsHttpService {

    constructor(private httpClient: HttpClient) { }

    private distributionUrl: string = `${CONFIG.backendUrl}distributions`;

    public getAll(): Observable<any> {
        return this.httpClient.get<any>(`${this.distributionUrl}/all`);
    }

    public paginate(query: string): Observable<any> {
        return this.httpClient.get<any>(`${this.distributionUrl}/pagination${query}`);
    }

    public getOneById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.distributionUrl}/one/${id}`);
    }

    public create(creation: any): Observable<any> {
        return this.httpClient.post<any>(`${this.distributionUrl}/create`, creation);
    }

    public update(id: number, update: any): Observable<any> {
        return this.httpClient.put<any>(`${this.distributionUrl}/one/update/${id}`, update);
    }

    public deleteMany(query: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.distributionUrl}/many${query}`);
    }

    public getItemById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.distributionUrl}/items/one/by-id/${id}`);
    }

    public getItemsByDistributionId(distributionId: number): Observable<any> {
        return this.httpClient.get<any>(`${this.distributionUrl}/items/many/by-distribution-id/${distributionId}`);
    }
}