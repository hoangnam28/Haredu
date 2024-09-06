import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { IAccount } from '#interfaces/account.interface';
import { MappingNameRoleByRoles } from 'src/app/config/sidebar.config';
import { TranslocoService } from '@ngneat/transloco';
import { AuthRepository } from '#repositories/auth.repository';
import { AuthService } from '#services/auth.service';
import { SOCKET_SCREEN_ACTION } from '#utils/const';
import { BaseSocketService } from '#services/socket.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent extends BaseComponent implements OnInit {
  dialogRef: NzModalRef;
  currentUrl: string = this.router.url;
  @Input() user: IAccount;
  roleName: string = '';
  currentLanguage: string = 'en';
  notifys: { isSend: boolean; notifyId: { title: string; link?: string; owner: { name: string } } }[] = [];

  constructor(
    protected componentService: ComponentService,
    private tranlocoService: TranslocoService,
    private authRepository: AuthRepository,
    private auth: AuthService,
    private socketConnect: BaseSocketService,
    private cdr: ChangeDetectorRef,
  ) {
    super(componentService);
    this.currentLanguage = tranlocoService.getActiveLang();
    this.socketConnect.connectSocket();
  }

  get notifyCount() {
    if (this.notifys.length === 0) return 0;
    return this.notifys.filter((item) => item.isSend === false).length ?? 0;
  }

  ngOnInit(): void {
    this.roleName = this.getRoleName();
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

  getAllNotify() {
    this.subscribeOnce(this.authRepository.getNotify(), {
      onSuccess: (res) => {
        this.notifys = res.data;
        this.cdr.detectChanges();
      },
    });
  }

  viewAllNotify() {
    this.subscribeOnce(this.authRepository.updateNotify(), {
      onSuccess: () => {
        this.subscribeOnce(this.authRepository.getNotify(), {
          onSuccess: (res) => {
            console.log('🚀 ~ NavbarComponent ~ this.subscribeOnce ~ res:', res);
            this.notifys = res.data;
            this.cdr.detectChanges();
          },
        });
      },
    });
  }
}
