import { ReportManageComponent } from './report-manage/report-manage.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';
import { InformationComponent } from './information/information.component';
import { LectureRegistrationComponent } from './lecture-registration/lecture-registration.component';
import { ShareModule } from '#components/share/share.module';
import { LectureDetailComponent } from '#components/core/modal/lecture-detail/lecture-detail.component';
import { LectureUpdateComponent } from './lecture-update/lecture-update.component';
import { LectureUpdateDetailComponent } from '#components/core/modal/lecture-update-detail/lecture-update-detail.component';
import { PostManageComponent } from './post-manage/post-manage.component';

@NgModule({
  declarations: [
    InformationComponent,
    LectureRegistrationComponent,
    LectureDetailComponent,
    LectureUpdateComponent,
    LectureUpdateDetailComponent,
    PostManageComponent,
    ReportManageComponent,
  ],
  imports: [CommonModule, StaffRoutingModule, ShareModule],
})
export class StaffModule {}
