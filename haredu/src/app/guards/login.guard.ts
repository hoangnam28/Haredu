import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LINK_LOGIN_GUARD, STRING } from '#utils/const';
import { getCookie } from '#utils/cookie.helper';
import { UserProfileService } from '#services/user-profile.service';
import { Location } from '@angular/common';
import { MappingLinkAfterLoginByRoles, MappingLinkByRoles } from '../config/user-drop-down.config';

@Injectable({
  providedIn: 'root',
})
export class LoginInjection {
  constructor(
    private router: Router,
    private userProfileService: UserProfileService,
    private location: Location,
  ) {}

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = state.url;
    const token = getCookie(STRING.ACCESS_TOKEN) || '';
    const user = this.userProfileService.currentUser ?? {};
    const isNotAllow = LINK_LOGIN_GUARD.some((link) => url.includes(link));

    if (!url.includes('auth') || (token && Object.keys(user).length && isNotAllow)) {
      const url = MappingLinkByRoles[user.role] + MappingLinkAfterLoginByRoles[user.role];
      this.router.navigate([url]);
      return false;
    }

    return true;
  }
}

export const LoginGuard = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
  inject(LoginInjection).canActivate(next, state);
