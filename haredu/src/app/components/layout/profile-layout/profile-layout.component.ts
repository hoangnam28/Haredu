import { ComponentService } from '#services/component.service';
import { BaseComponent } from '#components/core/base/base.component';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '#services/auth.service';
import { UserProfileService } from '#services/user-profile.service';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RouterEvent,
} from '@angular/router';
import { IMenu } from '#interfaces/menu.interface';
import { OWN_PROFILE_MEMU, USER_PROFILE_MENU } from 'src/app/config/sidebar.config';
import { LOGO } from '#utils/const';
import { AuthRepository } from '#repositories/auth.repository';
import { IAccount } from '#interfaces/account.interface';
import { SharedService } from '#services/shared.service';
import { MappingLogoDefaultLinkByRole } from 'src/app/config/logo.config';
import { UserRepository } from '#repositories/user.repository';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
  styleUrl: './profile-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileLayoutComponent extends BaseComponent implements OnInit {
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
    private activatedRoute: ActivatedRoute,
    private userRepository: UserRepository,
    private cdr: ChangeDetectorRef,
  ) {
    super(componentService);
    this.user = this.userProfileService.currentUser;
  }

  get slug() {
    return this.router.routerState.snapshot.url.split('/')?.[3];
  }

  ngOnInit(): void {
    this.router.events.subscribe((e) => {
      this.navigationInterceptor(e as RouterEvent);
    });
    this.getMenuItemsByRole();
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    window.innerWidth <= 768 ? this.sharedService.setIsCollapsed(true) : this.sharedService.setIsCollapsed(false);
  }

  trackBy(index: number): number {
    return index;
  }

  private getMenuItemsByRole() {
    console.log(this.slug);

    if (!!this.slug) {
      this.subscribeOnce(this.userRepository.getOneUser(this.slug), {
        onSuccess: (data) => {
          this.menuItems = USER_PROFILE_MENU(data);
        },
        onComplete: () => {
          this.cdr.detectChanges();
        },
      });
    } else {
      this.menuItems = OWN_PROFILE_MEMU(this.user.role);
    }
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
