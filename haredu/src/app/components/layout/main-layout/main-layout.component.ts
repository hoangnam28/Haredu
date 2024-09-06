import { ComponentService } from '#services/component.service';
import { BaseComponent } from '#components/core/base/base.component';
import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '#services/auth.service';
import { UserProfileService } from '#services/user-profile.service';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, RouterEvent } from '@angular/router';
import { IMenu } from '#interfaces/menu.interface';
import { MappingMenuByRoles } from 'src/app/config/sidebar.config';
import { LOGO } from '#utils/const';
import { AuthRepository } from '#repositories/auth.repository';
import { IAccount } from '#interfaces/account.interface';
import { SharedService } from '#services/shared.service';
import { MappingLogoDefaultLinkByRole } from 'src/app/config/logo.config';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent extends BaseComponent implements OnInit {
  menuItems: IMenu[];
  isFirstTimeLogin: boolean;
  hideSidebar: boolean = false;
  isCollapsed: boolean = false;
  logo = LOGO;
  user: IAccount;

  constructor(
    protected componentService: ComponentService,
    private auth: AuthService,
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private authRepository: AuthRepository,
    private sharedService: SharedService,
  ) {
    super(componentService);
    this.user = this.userProfileService.currentUser;
  }

  ngOnInit(): void {
    this.router.events.subscribe((e) => {
      this.navigationInterceptor(e as RouterEvent);
    });
    this.menuItems = this.getMenuItemsByRole();
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    window.innerWidth <= 768 ? this.sharedService.setIsCollapsed(true) : this.sharedService.setIsCollapsed(false);
  }

  trackBy(index: number): number {
    return index;
  }

  private getMenuItemsByRole(): IMenu[] {
    return MappingMenuByRoles[this.user.role];
  }

  private navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loadingService.setLoading(true);
    }
    if (event instanceof NavigationEnd) {
      this.loadingService.setLoading(false);
    }
    if (event instanceof NavigationCancel) {
      this.loadingService.setLoading(false);
    }
    if (event instanceof NavigationError) {
      this.loadingService.setLoading(false);
    }
  }

  async logout() {
    this.subscribeOnce(this.authRepository.logout(), {
      onSuccess: () => {
        this.componentService.toast.success('toast.logoutSuccessful');
      },
      onComplete: () => {
        this.auth.endSession();
      },
    });
  }

  private getMenuItemsMappingByRole(): string {
    return MappingLogoDefaultLinkByRole[this.user.role];
  }

  redirectLinkLogo() {
    const link = this.getMenuItemsMappingByRole();
    this.redirect(link);
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.sharedService.setIsCollapsed(this.isCollapsed);
  }
}
