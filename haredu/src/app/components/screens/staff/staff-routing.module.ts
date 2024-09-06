import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformationComponent } from './information/information.component';
import { LectureRegistrationComponent } from './lecture-registration/lecture-registration.component';
import { LectureUpdateComponent } from './lecture-update/lecture-update.component';
import { PostManageComponent } from './post-manage/post-manage.component';
import { ReportManageComponent } from './report-manage/report-manage.component';

const routes: Routes = [
  { path: 'information', component: InformationComponent },
  { path: 'lecture-registration', component: LectureRegistrationComponent },
  { path: 'lecture-update', component: LectureUpdateComponent },
  { path: 'article-manage', component: PostManageComponent },
  { path: 'report-manage', component: ReportManageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffRoutingModule {}
