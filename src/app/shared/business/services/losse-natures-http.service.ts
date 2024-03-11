import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../env';

@Injectable({ providedIn: 'root' })
export class LosseNaturesHttpService {

    constructor(private httpClient: HttpClient) { }

    private losseNatureUrl: string = `${CONFIG.backendUrl}losse-natures`;

    public getAll(): Observable<any> {
        return this.httpClient.get<any>(`${this.losseNatureUrl}/all`);
    }

    public paginate(query: string): Observable<any> {
        return this.httpClient.get<any>(`${this.losseNatureUrl}/pagination${query}`);
    }

    public getOneById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.losseNatureUrl}/one/${id}`);
    }

    public create(creation: any): Observable<any> {
        return this.httpClient.post<any>(`${this.losseNatureUrl}/create`, creation);
    }

    public update(id: number, update: any): Observable<any> {
        return this.httpClient.put<any>(`${this.losseNatureUrl}/one/update/${id}`, update);
    }

    public deleteMany(query: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.losseNatureUrl}/many${query}`);
    }
}