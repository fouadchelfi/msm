import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../env';

@Injectable({ providedIn: 'root' })
export class ChargeNaturesHttpService {

    constructor(private httpClient: HttpClient) { }

    private chargeNatureUrl: string = `${CONFIG.backendUrl}charge-natures`;

    public getAll(): Observable<any> {
        return this.httpClient.get<any>(`${this.chargeNatureUrl}/all`);
    }

    public paginate(query: string): Observable<any> {
        return this.httpClient.get<any>(`${this.chargeNatureUrl}/pagination${query}`);
    }

    public getOneById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.chargeNatureUrl}/one/${id}`);
    }

    public create(creation: any): Observable<any> {
        return this.httpClient.post<any>(`${this.chargeNatureUrl}/create`, creation);
    }

    public update(id: number, update: any): Observable<any> {
        return this.httpClient.put<any>(`${this.chargeNatureUrl}/one/update/${id}`, update);
    }

    public deleteMany(query: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.chargeNatureUrl}/many${query}`);
    }
}