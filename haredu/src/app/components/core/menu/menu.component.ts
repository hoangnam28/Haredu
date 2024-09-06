import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { IMenu } from '#interfaces/menu.interface';
import { ComponentService } from '#services/component.service';
import { StorageService } from '#services/storage.service';
import { filter, Subscription } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { UserProfileService } from '#services/user-profile.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent extends BaseComponent {
  @Input() data: IMenu[];
  @Input() disabled: boolean;
  @Input() class: string;
  @Input() isCollapsed: boolean = false;
  @Input() mode: 'vertical' | 'horizontal' | 'inline' = 'inline';

  subscription: Subscription;

  constructor(
    componentService: ComponentService,
    private cdr: ChangeDetectorRef,
    private storageService: StorageService,
    private user: UserProfileService,
  ) {
    super(componentService);
  }

  ngOnInit() {
    this.subscription = this.router.events.pipe(filter((i) => i instanceof NavigationEnd)).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  override ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private isActiveRoute(link?: string): boolean {
    let checkURL = false;
    const path = window.location.pathname;
    checkURL = !!link && path.includes(link);

    return checkURL;
  }

  isActive(item: IMenu): boolean {
    if (item.children) {
      return item.children.some((route) => this.isActiveRoute(route.routerLink));
    }

    return this.isActiveRoute(item.routerLink);
  }

  redirectTo(routerLink?: string) {
    if (this.disabled || !routerLink) return;
    this.redirect(routerLink);
  }
}
