import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { FlashMessageService } from './flash-message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService, 
    private router: Router,
    private flashMessageService: FlashMessageService,
    private route: ActivatedRoute
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (!this.authService.isLoggedIn()) {
      this.flashMessageService.setMessage('error', "⚠️ It looks like you're not signed in.<br>Please log in to proceed.");
      this.router.navigate(['/login']);
      return false;
    }

    const role = this.authService.getRole(); // this function returns: 'admin', 'rh', or 'candidat'
    const url = state.url;

    // Block access based on role
    if (
      (role === 'admin' && (url.startsWith('/front') || url.startsWith('/back-hr'))) ||
      (role === 'rh' && ((url.startsWith('/back') && !url.startsWith('/back-hr')) || url.startsWith('/front'))) ||
      (role === 'candidate' && (url.startsWith('/back') || url.startsWith('/back-hr')))
    ) {
      //Redirection to a Error AccessDenied
      this.router.navigate(['access-denied']);
      return false;
    }

    return true; // Authorized
  }
}