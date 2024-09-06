import { BaseComponent } from '#components/core/base/base.component';
import { IAccount } from '#interfaces/account.interface';
import { IMenu } from '#interfaces/menu.interface';
import { AuthRepository } from '#repositories/auth.repository';
import { AuthService } from '#services/auth.service';
import { ComponentService } from '#services/component.service';
import { BaseSocketService } from '#services/socket.service';
import { StorageService } from '#services/storage.service';
import { LocalStorageKey, LOGO, SOCKET_SCREEN_ACTION } from '#utils/const';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { MappingHeaderByRoles } from 'src/app/config/header.config';
import { MappingNameRoleByRoles } from 'src/app/config/sidebar.config';
import { MappingLinkAfterLoginByRoles } from 'src/app/config/user-drop-down.config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent extends BaseComponent implements OnInit {
  dialogRef: NzModalRef;
  currentUrl: string = this.router.url;
  menuItem: IMenu[];
  @Input() user: IAccount;
  roleName: string = '';
  currentLanguage: string = 'en';
  logo = LOGO;
  notifys: { isSend: boolean; notifyId: { title: string; link?: string; owner: { name: string } } }[] = [];

  constructor(
    protected componentService: ComponentService,
    private tranlocoService: TranslocoService,
    private authRepository: AuthRepository,
    private auth: AuthService,
    private socketConnect: BaseSocketService,
    private storage: StorageService,
    private cdr: ChangeDetectorRef,
  ) {
    super(componentService);
    this.currentLanguage = tranlocoService.getActiveLang();
    this.socketConnect.connectSocket();
    this.storage.getSession(LocalStorageKey.isSend);
  }

  get notifyCount() {
    if (this.notifys.length === 0) return 0;
    return this.notifys.filter((item) => item.isSend === false).length ?? 0;
  }

  ngOnInit(): void {
    this.roleName = this.getRoleName();
    this.menuItem = this.getHeaderMenu();
    this.socket.sendMessage(SOCKET_SCREEN_ACTION.JOIN_NOTIFY, {
      userId: this.user._id,
    });
    this.subscribeUntilDestroy(
      this.socket.getMessage<any>(SOCKET_SCREEN_ACTION.USER_JOIN_NOTIFY),
      async ({ payload }) => {
        this.notifys = payload.notify;
        this.cdr.detectChanges();
      },
    );

    this.subscribeUntilDestroy(this.socket.getMessage<any>(SOCKET_SCREEN_ACTION.SEND_NOTIFY), async ({ payload }) => {
      this.subscribeOnce(this.authRepository.getNotify(), {
        onSuccess: (res) => {
          this.notifys = res.data;
          this.cdr.detectChanges();
        },
      });
      this.cdr.detectChanges();
    });
  }

  handleChangeLang(lang: string) {
    this.currentLanguage = lang;
    this.tranlocoService.setActiveLang(lang);
    localStorage.setItem('lang', lang);
  }

  getRoleName(): string {
    return MappingNameRoleByRoles[this.user.role];
  }

  getHeaderMenu(): IMenu[] {
    return MappingHeaderByRoles[this.user.role];
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
  redirectTo(routerLink?: string) {
    if (!routerLink) return;
    this.redirect(routerLink);
  }

  redirectHome() {
    const url = MappingLinkAfterLoginByRoles[this.user.role];
    this.redirect(url);
  }

  viewAllNotify() {
    this.subscribeOnce(this.authRepository.updateNotify(), {
      onSuccess: () => {
        this.subscribeOnce(this.authRepository.getNotify(), {
          onSuccess: (res) => {
            this.notifys = res.data;
            this.cdr.detectChanges();
          },
        });
      },
    });
  }
}
