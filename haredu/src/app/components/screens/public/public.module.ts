import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { ShareModule } from '#components/share/share.module';
import { HomepageComponent } from './homepage/homepage.component';
import { PostComponent } from './post/post.component';
import { PostCardComponent } from './post-card/post-card.component';
import { ClassesOpenComponent } from './classes-open/classes-open.component';
import { VideoComponent } from './video/video.component';
import { VideoCardComponent } from './video-card/video-card.component';
import { ClassroomComponent } from './classroom/classroom.component';
import { CreateSlotComponent } from '#components/core/modal/create-slot/create-slot.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { SlotDetailComponent } from './slot-detail/slot-detail.component';
import { MettingComponent } from './metting/metting.component';
import { VideoDetailComponent } from './video-detail/video-detail.component';
import { MeetingDemoComponent } from './meeting-demo/meeting-demo.component';
import { RouterModule } from '@angular/router';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';

@NgModule({
  declarations: [
    HomepageComponent,
    PostComponent,
    PostCardComponent,
    ClassesOpenComponent,
    VideoComponent,
    VideoDetailComponent,
    VideoCardComponent,
    ClassroomComponent,
    CreateSlotComponent,
    PostDetailComponent,
    SchedulesComponent,
    SlotDetailComponent,
    MettingComponent,
    MeetingDemoComponent,
  ],
  imports: [CommonModule, PublicRoutingModule, ShareModule, RouterModule, NzAutocompleteModule],
})
export class PublicModule {}
