import { UserProfileService } from './user-profile.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getCookie, removeAllCookies, replaceCookie } from '#utils/cookie.helper';
import { STRING } from '#utils/const';
import { ILoginResponse } from '#interfaces/account.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = !!getCookie(STRING.ACCESS_TOKEN) && !!getCookie(STRING.REFRESH_TOKEN);
  redirectUrl: string;

  constructor(
    private router: Router,
    private userProfileService: UserProfileService,
  ) {}

  endSession(): void {
    this.isLoggedIn = false;
    this.userProfileService.currentUser = null;
    removeAllCookies();
    this.router.navigate(['/auth/login']);
  }

  startSession({ accessToken, refreshToken, user }: ILoginResponse): void {
    replaceCookie(STRING.ACCESS_TOKEN, accessToken);
    replaceCookie(STRING.REFRESH_TOKEN, refreshToken);
    this.isLoggedIn = true;
    this.userProfileService.currentUser = user;
    const redirectUrl = this.redirectUrl ? this.router.parseUrl(this.redirectUrl) : '/error404';
    this.router.navigateByUrl(redirectUrl);
  }
}
