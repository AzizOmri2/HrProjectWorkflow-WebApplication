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

    if (!this.authService.isLoggedIn()) {
      this.flashMessageService.setMessage('error', 'You need to sign in.');
      this.router.navigate(['/login']);
      return false;
    }

    const role = this.authService.getRole(); // assume this returns: 'admin', 'hr', or 'candidat'
    const url = state.url;

    // Block access based on role
    if (
      (role === 'admin' && (url.startsWith('/front') || url.startsWith('/back-hr'))) ||
      (role === 'rh' && (url.startsWith('/back') || url.startsWith('/front'))) ||
      (role === 'candidat' && (url.startsWith('/back') || url.startsWith('/back-hr')))
    ) {
      this.router.navigate(['/']); // redirect to a safe route
      return false;
    }

    return true; // Authorized
  }
}