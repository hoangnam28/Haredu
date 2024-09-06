import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LectureWithdrawComponent } from './lecture-withdraw/lecture-withdraw.component';

const routes: Routes = [{ path: 'lecture-withdraw', component: LectureWithdrawComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
