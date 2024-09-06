import { BaseComponent } from '#components/core/base/base.component';
import { IAccount } from '#interfaces/account.interface';
import { ComponentService } from '#services/component.service';
import { UserProfileService } from '#services/user-profile.service';
import { LOGO } from '#utils/const';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MappingLinkByRoles } from 'src/app/config/user-drop-down.config';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent extends BaseComponent implements OnInit {
  logo = LOGO;
  user: IAccount;
  url = '';

  constructor(
    protected componentService: ComponentService,
    private userProfileService: UserProfileService,
  ) {
    super(componentService);
  }
  ngOnInit(): void {
    this.user = this.userProfileService.currentUser;
  }

  redirecToHome() {
    if (!Object.keys(this.user).length) {
      this.redirect('/auth/login');
      return;
    }
    const role = this.user.role;
    this.url = MappingLinkByRoles[role] + 'dashboard';
    this.redirect(this.url);
  }
}
