// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { AppStateService } from '../services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private localStorage: LocalStorageService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Add authorization header with JWT token if available
        const authToken = this.localStorage.getAuthToken();
        if (authToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${authToken}`
                }
            });
        }
        return next.handle(request);
    }
}
