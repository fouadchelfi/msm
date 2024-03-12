import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../env';

@Injectable({ providedIn: 'root' })
export class QuantityCorrectionsHttpService {

    constructor(private httpClient: HttpClient) { }

    private quantitycorrectionUrl: string = `${CONFIG.backendUrl}quantity-corrections`;

    public getAll(): Observable<any> {
        return this.httpClient.get<any>(`${this.quantitycorrectionUrl}/all`);
    }

    public paginate(query: string): Observable<any> {
        return this.httpClient.get<any>(`${this.quantitycorrectionUrl}/pagination${query}`);
    }

    public getOneById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.quantitycorrectionUrl}/one/${id}`);
    }

    public create(creation: any): Observable<any> {
        return this.httpClient.post<any>(`${this.quantitycorrectionUrl}/create`, creation);
    }

    public update(id: number, update: any): Observable<any> {
        return this.httpClient.put<any>(`${this.quantitycorrectionUrl}/one/update/${id}`, update);
    }

    public deleteMany(query: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.quantitycorrectionUrl}/many${query}`);
    }
}