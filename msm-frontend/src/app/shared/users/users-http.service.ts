import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../env';

@Injectable({ providedIn: 'root' })
export class UsersHttpService {

    constructor(private httpClient: HttpClient) { }

    private userUrl: string = `${CONFIG.backendUrl}users`;

    public getAll(): Observable<any> {
        return this.httpClient.get<any>(`${this.userUrl}/all`);
    }

    public paginate(query: string): Observable<any> {
        return this.httpClient.get<any>(`${this.userUrl}/pagination${query}`);
    }

    public getOneById(id: number): Observable<any> {
        return this.httpClient.get<any>(`${this.userUrl}/one/${id}`);
    }

    public create(creation: any): Observable<any> {
        return this.httpClient.post<any>(`${this.userUrl}/create`, creation);
    }

    public update(id: number, update: any): Observable<any> {
        return this.httpClient.put<any>(`${this.userUrl}/one/update/${id}`, update);
    }

    public deleteMany(query: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.userUrl}/many${query}`);
    }

    public changePassword(id: number, update: any): Observable<any> {
        return this.httpClient.put<any>(`${this.userUrl}/one/change-password/${id}`, update);
    }
}