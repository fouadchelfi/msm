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
}