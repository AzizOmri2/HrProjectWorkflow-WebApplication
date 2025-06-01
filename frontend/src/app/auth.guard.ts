import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { FlashMessageService } from './flash-message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router,private flashMessageService: FlashMessageService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // Check if user is authenticated by verifying if a token exists
    if (this.authService.isLoggedIn()) {
      return true; // Allow access to the route
    } else {
      // Redirect to login if not authenticated
      this.router.navigate(['/login']);
      this.flashMessageService.setMessage('error', 'You need to sign in.');
      return false; // Deny access to the route
    }
  }
}