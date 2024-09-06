import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingService } from '#services/loading.service';
import { getCookie } from '#utils/cookie.helper';
import { STRING } from '#utils/const';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}
  private totalRequests = 0;
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = getCookie(STRING.ACCESS_TOKEN);
    const isAssetsRequest = request.url.startsWith('./assets');
    !isAssetsRequest && this.totalRequests++;
    !isAssetsRequest && this.loadingService.setLoading(true);
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (token && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      finalize(() => {
        !isAssetsRequest && this.totalRequests--;
        if (!this.totalRequests) {
          this.loadingService.setLoading(false);
        }
      }),
    );
  }
}
