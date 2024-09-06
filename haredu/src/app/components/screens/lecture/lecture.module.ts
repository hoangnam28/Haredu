import { ShareModule } from '#components/share/share.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LectureRoutingModule } from './lecture-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, LectureRoutingModule, ShareModule],
})
export class LectureModule {}
