import { Injectable } from '@angular/core';
import { AuthService } from '..';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) { }

    canActivate(): boolean {
        if (this.auth.isUserAuthenticated()) {
            return true;
        } else {
            // Redirect to login page if not authenticated
            this.router.navigate(['/auth/login']);
            return false;
        }
    }
}
