import { IAccount } from '#interfaces/account.interface';
import { UserProfileService } from '#services/user-profile.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-normal-layout',
  templateUrl: './normal-layout.component.html',
  styleUrl: './normal-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NormalLayoutComponent {
  user: IAccount;
  constructor(private userProfileService: UserProfileService) {
    this.user = this.userProfileService.currentUser;
  }
}
