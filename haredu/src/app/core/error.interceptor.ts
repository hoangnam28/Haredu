import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { AuthService } from '#services/auth.service';
import { getCookie, replaceCookie } from '#utils/cookie.helper';
import { jwtIsValid } from '#utils/jwt.helper';
import { AuthRepository } from '#repositories/auth.repository';
import { STRING } from '#utils/const';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthService,
    private authRepository: AuthRepository,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isShowErrorToast = request.headers.get('showerrortoast');
    return next.handle(request).pipe(
      catchError((err) => {
        if ([401, 403].includes(err.status)) {
          return this.checkAuth().pipe(
            switchMap(() => {
              const token = getCookie(STRING.ACCESS_TOKEN);
              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`,
                },
              });
              return next.handle(request).pipe(retry(1));
            }),
          );
        }

        err.error = { ...err.error, isShowErrorToast };
        return throwError(err);
      }),
    );
  }

  private checkAuth(): Observable<null> {
    const accessToken = getCookie(STRING.ACCESS_TOKEN);
    const isValid = jwtIsValid(accessToken || '');

    if (!isValid) {
      return this.authRepository.renewToken().pipe(
        switchMap((res) => {
          replaceCookie(STRING.ACCESS_TOKEN, res.data);
          return of(null);
        }),
        catchError((error) => {
          this.authenticationService.endSession();
          return throwError(error);
        }),
      );
    }
    return of(null);
  }
}
