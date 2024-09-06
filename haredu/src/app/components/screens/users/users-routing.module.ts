import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { WalletComponent } from './wallet/wallet.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DesiredCourseComponent } from './desired-course/desired-course.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { MyClassesComponent } from './my-classes/my-classes.component';
import { CreateUpdateClassComponent } from './create-update-class/create-update-class.component';
import { VideoDemoComponent } from './video-demo/video-demo.component';
import { SetUpSlotComponent } from './set-up-slot/set-up-slot.component';
import { UserProfileViewComponent } from './user-profile/user-profile-view.component';
import { VideoDemoViewComponent } from './video-demo/video-demo-view.component';
import { MyScheduleComponent } from './my-schedule/my-schedule.component';

const routes: Routes = [
  { path: 'profile', component: UserProfileComponent },
  { path: 'profile/:slug', component: UserProfileViewComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'desired-course', component: DesiredCourseComponent },
  { path: 'transaction-history', component: TransactionHistoryComponent },
  { path: 'video-demo', component: VideoDemoComponent },
  { path: 'my-schedule', component: MyScheduleComponent },
  { path: 'video-demo/:slug', component: VideoDemoViewComponent },
  { path: 'my-classes', component: MyClassesComponent },
  { path: 'my-classes/create', component: CreateUpdateClassComponent },
  { path: 'my-classes/update', component: CreateUpdateClassComponent },
  { path: 'my-classes/create/set-up/:id', component: SetUpSlotComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
