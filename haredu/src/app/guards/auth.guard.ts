import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { getCookie } from '#utils/cookie.helper';
import { STRING, USER_ROLE } from '#utils/const';
import { UserProfileService } from '#services/user-profile.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInjection {
  constructor(
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private router: Router,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = state.url;
    const expectedRole = next.data.expectedRole;
    const validRequest = this.checkLogin(url, expectedRole);

    !validRequest && this.router.navigate(['/auth/login']);

    return validRequest;
  }

  checkLogin(url: string, expectedRole: USER_ROLE[]): boolean {
    const token = getCookie(STRING.ACCESS_TOKEN) || '';
    const user = this.userProfileService.currentUser ?? {};
    if (token && Object.keys(user).length) {
      if (!expectedRole) return true;
      if (expectedRole.includes(user.role)) return true;
    }

    this.authService.redirectUrl = url;
    return false;
  }
}

export const AuthGuard = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
  inject(AuthInjection).canActivate(next, state);
