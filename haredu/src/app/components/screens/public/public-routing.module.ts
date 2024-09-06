import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { PostComponent } from './post/post.component';
import { ClassesOpenComponent } from './classes-open/classes-open.component';
import { VideoComponent } from './video/video.component';
import { ClassroomComponent } from './classroom/classroom.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { SlotDetailComponent } from './slot-detail/slot-detail.component';
import { MettingComponent } from './metting/metting.component';
import { VideoDetailComponent } from './video-detail/video-detail.component';
import { MeetingDemoComponent } from './meeting-demo/meeting-demo.component';

const routes: Routes = [
  { path: 'homepage', component: HomepageComponent },
  { path: 'posts', component: PostComponent },
  { path: 'classes-open', component: ClassesOpenComponent },
  { path: 'videos', component: VideoComponent },
  { path: 'videos/:id', component: VideoDetailComponent },
  { path: 'classroom/:id', component: ClassroomComponent },
  { path: 'classroom/slot/:id', component: SlotDetailComponent },
  { path: 'classroom/slot/meeting/:id', component: MettingComponent },
  { path: 'meeting-demo/:id', component: MeetingDemoComponent },
  { path: 'posts/detail/:id', component: PostDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
