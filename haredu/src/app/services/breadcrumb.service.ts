import { BehaviorSubject, Observable, Subscription, filter } from 'rxjs';
import { IBreadcrumbItem } from '#interfaces/index';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BREADCRUMB } from '#utils/breadcrumb';
import { StorageService } from './storage.service';
import { FormType, LocalStorageKey } from '#utils/const';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  protected _breadcrumb = new BehaviorSubject<IBreadcrumbItem[]>([]);
  protected subscription: Subscription;

  // constructor(
  //   public router: Router,
  //   private storageService: StorageService,
  // ) {
  //   this.subscription = this.router.events.pipe(filter((i) => i instanceof NavigationEnd)).subscribe((e) => {
  //     const { urlAfterRedirects } = e as NavigationEnd;
  //     if (TOP_MENU.some((i) => urlAfterRedirects.includes(i))) {
  //       const prefix = urlAfterRedirects.split('/')[2];
  //       const homeUrl = BREADCRUMB[prefix] as { [key: string]: string };

  //       const homeItem: IBreadcrumbItem[] = [];
  //       if (homeUrl.home) {
  //         const home = homeUrl.home.split(';');
  //         home.forEach((value) => {
  //           value && homeItem.push({ label: value, url: '/' + urlAfterRedirects.split('/')[1] + '/' + prefix });
  //         });
  //       }
  //       this.setBreadCrumb([...homeItem, { label: this.getRouteName(urlAfterRedirects), url: urlAfterRedirects }]);
  //       this._breadcrumb.next(this.breadcrumbItem);
  //       return;
  //     }
  //     this.buildBreadcrumb(urlAfterRedirects);
  //     this._breadcrumb.next(this.breadcrumbItem);
  //   });
  // }

  constructor(
    public router: Router,
    private storageService: StorageService,
  ) {
    this.subscription = this.router.events.pipe(filter((i) => i instanceof NavigationEnd)).subscribe((e) => {
      const { urlAfterRedirects } = e as NavigationEnd;
      const defaultUrl = urlAfterRedirects.split('/')[1];
      const prefix = urlAfterRedirects.split('/')[2];
      const homeUrl = BREADCRUMB[prefix] as { [key: string]: string };
      const urlParts = urlAfterRedirects.split('/');
      const homeItem: IBreadcrumbItem[] = [];
      if (homeUrl?.home) {
        const home = homeUrl.home.split(';');
        home.forEach((value) => {
          value && homeItem.push({ label: value, url: '/' + defaultUrl + '/' + prefix });
        });
      }
      if (urlParts.length > 3) {
        let currentUrl = '/' + defaultUrl + '/' + prefix + '/';
        for (let index = 3; index < urlParts.length; index++) {
          const url = urlParts[index];
          homeItem.push({ label: homeUrl[urlParts[index]], url: currentUrl + url });
          currentUrl += url + '/';
        }
      }

      this.setBreadCrumb([...homeItem]);
      this.buildBreadcrumb(urlAfterRedirects);
      this._breadcrumb.next(this.breadcrumbItem);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get breadcrumbItem(): IBreadcrumbItem[] {
    return JSON.parse(this.storageService.getSession(LocalStorageKey.breadCrumb)!);
  }

  get prevBreadcrumbItem(): IBreadcrumbItem[] {
    return JSON.parse(this.storageService.getSession(LocalStorageKey.prevBreadcrumb)!);
  }

  setBreadCrumb(item: IBreadcrumbItem[]) {
    this.storageService.setSession(LocalStorageKey.breadCrumb, JSON.stringify(item));
  }

  setPrevBreadcrumb(item: IBreadcrumbItem[]) {
    this.storageService.setSession(LocalStorageKey.prevBreadcrumb, JSON.stringify(item));
  }

  get $breadcrumb(): Observable<IBreadcrumbItem[]> {
    return this._breadcrumb.asObservable();
  }

  protected buildBreadcrumb(url: string) {
    const index = this.indexOfCommand(url);
    if (index === this.breadcrumbItem.length - 1 && this.breadcrumbItem.length > 0) return;

    if (index === -1) {
      // eslint-disable-next-line no-console
      console.log('%cNext Command: ', 'color: yellow', url);
      this.setBreadCrumb([...this.breadcrumbItem, { label: this.getRouteName(url), url }]);
      return;
    }

    // eslint-disable-next-line no-console
    console.log('%cBack Command: ', 'color: lightblue', url);
    this.setBreadCrumb([...this.breadcrumbItem.slice(0, index + 1)]);
  }

  protected indexOfCommand(command: string): number {
    return this.breadcrumbItem.findIndex((i) => i.url.includes(command));
  }

  protected getRouteName(command: string): string {
    const split = command.split('/');
    const prefix = Object.keys(BREADCRUMB).find((br) => split.includes(br));
    if (!prefix) return 'unknown';
    const route = BREADCRUMB[prefix];
    if (typeof route === 'string') return route as string;

    let suffix = '',
      suffixIndex = 0;
    for (let i = 0; i < split.length; i++) {
      const isCorrectPath = Object.keys(Object(route)).includes(split[i]);
      if (isCorrectPath) {
        suffix = split[i];
        suffixIndex = i;
        if (suffix === 'form' && suffixIndex !== split.length - 1 && split[suffixIndex + 1] !== 'list') continue;
        break;
      }
    }

    if (!suffix) return 'unknown';

    const breadcrumb = route[suffix];

    if (typeof breadcrumb === 'object') {
      const formType = split[split.length - 1] as FormType;
      if (Object.keys(breadcrumb).includes(formType)) return breadcrumb[formType] as string;
      return breadcrumb.manager as string;
    }

    return route[suffix] as string;
  }
}
