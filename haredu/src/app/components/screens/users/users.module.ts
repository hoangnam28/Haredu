import { WithdrawMoneyComponent } from './../../core/modal/withdraw-money/withdraw-money.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ShareModule } from '#components/share/share.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { WalletComponent } from './wallet/wallet.component';
import { BankAccountComponent } from '#components/core/modal/bank-account/bank-account.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DesiredCourseComponent } from './desired-course/desired-course.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { MyClassesComponent } from './my-classes/my-classes.component';
import { CreateUpdateClassComponent } from './create-update-class/create-update-class.component';
import { VideoDemoComponent } from './video-demo/video-demo.component';
import { VideoUpdateComponent } from './video-update/video-update.component';
import { SetUpSlotComponent } from './set-up-slot/set-up-slot.component';
import { UserProfileViewComponent } from './user-profile/user-profile-view.component';
import { VideoDemoViewComponent } from './video-demo/video-demo-view.component';
import { DepositMoneyComponent } from './deposit-money/deposit-money.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { MyScheduleComponent } from './my-schedule/my-schedule.component';

@NgModule({
  declarations: [
    UserProfileComponent,
    UserProfileViewComponent,
    WalletComponent,
    BankAccountComponent,
    WithdrawMoneyComponent,
    ChangePasswordComponent,
    DesiredCourseComponent,
    VideoDemoComponent,
    VideoDemoViewComponent,
    VideoUpdateComponent,
    TransactionHistoryComponent,
    MyClassesComponent,
    CreateUpdateClassComponent,
    SetUpSlotComponent,
    DepositMoneyComponent,
    MyScheduleComponent,
  ],
  imports: [CommonModule, UsersRoutingModule, ShareModule, NzAlertModule],
})
export class UsersModule {}
