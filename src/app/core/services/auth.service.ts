import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private localStorage: LocalStorageService) { }

    isUserAuthenticated() {
        return this.localStorage.getAuthToken() ? true : false;
    }

    logout() {
        this.localStorage.removeAuthToken();
    }
}