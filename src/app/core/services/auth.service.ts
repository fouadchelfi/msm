import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private localStorage: LocalStorageService, private router: Router) { }

    isUserAuthenticated() {
        return this.localStorage.getAuthToken() ? true : false;
    }

    logout() {
        this.localStorage.removeAuthToken();
        this.router.navigate(['/auth/login']);
    }
}