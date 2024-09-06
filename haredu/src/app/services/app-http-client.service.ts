/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpErrorHandler } from './http-error-handler.service';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BaseResponseApi } from '#interfaces/api.interface';
import { IExport, IDummy } from '#interfaces/index';

@Injectable()
export class AppHttpClient {
  static prefix = environment.apiUrl;

  /**
   * AppHttpClient Constructor.
   */
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler,
  ) {}

  public export(uri: string, body?: IExport): Observable<HttpResponse<Blob>> {
    return this.httpClient
      .post<Blob>(this.prefixUri(uri), body, {
        observe: 'response',
        responseType: 'blob' as 'json',
        headers: this.generateHttpHeaders(),
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  public get<T>(
    uri: string,
    params = {},
    configs: any = {},
  ): Observable<BaseResponseApi<T>> {
    const httpParams = this.generateHttpParams(params);
    return this.httpClient
      .get<BaseResponseApi<T>>(this.prefixUri(uri), {
        reportProgress: configs.reportProgress,
        params: httpParams,
        headers: this.generateHttpHeaders(configs.headers),
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  public post<T>(
    uri: string,
    params: null | { [key: string]: any } = null,
    configs: any = {},
  ): Observable<BaseResponseApi<T>> {
    return this.httpClient
      .post<BaseResponseApi<T>>(this.prefixUri(uri), params, {
        reportProgress: configs.reportProgress,
        headers: this.generateHttpHeaders(configs.headers, configs.multipart),
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  public put<T>(
    uri: string,
    params: object = {},
  ): Observable<BaseResponseApi<T>> {
    return this.httpClient
      .put<BaseResponseApi<T>>(this.prefixUri(uri), params, {
        headers: this.generateHttpHeaders(),
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  public patch<T>(
    uri: string,
    params: object = {},
    configs: any = {},
  ): Observable<BaseResponseApi<T>> {
    return this.httpClient
      .patch<BaseResponseApi<T>>(this.prefixUri(uri), params, {
        headers: this.generateHttpHeaders(configs.headers),
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  public delete<T>(uri: string): Observable<BaseResponseApi<T>> {
    return this.httpClient
      .delete<BaseResponseApi<T>>(this.prefixUri(uri), {
        headers: this.generateHttpHeaders(),
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * Prefix specified uri with backend API prefix.
   */
  private prefixUri(uri: string) {
    if (uri.includes('http')) {
      return uri;
    }

    return AppHttpClient.prefix + uri;
  }

  /**
   * Generate http params for GET request.
   */
  private generateHttpParams(params: IDummy) {
    let httpParams = new HttpParams();

    for (const key in params) {
      // eslint-disable-next-line no-prototype-builtins
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.append(key, params[key]);
      }
    }

    return httpParams;
  }

  private generateHttpHeaders(
    headerInfo?: { [key: string]: any },
    isMultiPart = false,
  ) {
    let headers = new HttpHeaders();

    !isMultiPart && headers.append('Content-Type', 'application/json');

    if (headerInfo) {
      for (const header of Object.keys(headerInfo)) {
        if (headerInfo[header]) {
          headers = headers.set(header, headerInfo[header]);
        } else {
          headers = headers.delete(header);
        }
      }
    }

    return headers;
  }

  private handleError(error: HttpErrorResponse) {
    return this.errorHandler.handle(error);
  }
}
