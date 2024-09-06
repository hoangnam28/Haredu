import { BaseComponent } from '#components/core/base/base.component';
import { UserRepository } from '#repositories/user.repository';
import { VideoRepository } from '#repositories/video.repository';
import { ComponentService } from '#services/component.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { VideoUpdateComponent } from '../video-update/video-update.component';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video-demo',
  templateUrl: './video-demo-view.component.html',
  styleUrls: ['./video-demo-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoDemoViewComponent extends BaseComponent implements OnInit {
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userRepository: UserRepository,
    private videoRepository: VideoRepository,
    private activatedRoute: ActivatedRoute,
  ) {
    super(componentService);
  }
  categorizedVideos: any[];
  listVideoRender: any[];
  serverUrl = environment.serverUrl;

  get slug() {
    return this.activatedRoute.snapshot.params['slug'];
  }

  ngOnInit(): void {
    this.getUserVideo(this.slug);
  }

  private getUserVideo(slug: string) {
    this.subscribeOnce(this.videoRepository.getUserVideo(slug), {
      onSuccess: (data) => {
        this.listVideoRender = this.getVideoRender(data);
        console.log(this.listVideoRender);
      },
      onComplete: () => {
        this.cdr.detectChanges();
      },
    });
  }

  getVideoRender(videoList: any[]) {
    const categorizedVideos = videoList.reduce((acc, video) => {
      const { name } = video.teachingFiledId;
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(video);
      return acc;
    }, {});

    // Chuyển đổi categorizedVideos thành mảng các đối tượng
    const categorizedVideosArray = Object.entries(categorizedVideos).map(([key, value]) => ({
      name: key,
      listVideo: value,
    }));
    return categorizedVideosArray;
  }
}
