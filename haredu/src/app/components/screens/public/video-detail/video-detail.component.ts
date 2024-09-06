import { BaseComponent } from '#components/core/base/base.component';
import { VideoRepository } from '#repositories/video.repository';
import { ComponentService } from '#services/component.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoDetailComponent extends BaseComponent implements OnInit {
  @ViewChild('videoElement') videoElement: ElementRef<HTMLVideoElement>;
  constructor(
    protected componentService: ComponentService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private videoRepository: VideoRepository,
  ) {
    super(componentService);
  }

  //=================================VARIABLE=========================================
  private routeSub: Subscription;

  serverUrl = environment.serverUrl;
  dataScreen: any;
  video: string = '';
  //=================================VARIABLE=========================================

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      this.subscribeOnce(this.videoRepository.getOneVideo(id), {
        onSuccess: (data) => {
          this.dataScreen = data;
          this.videoElement.nativeElement.src = this.serverUrl + this.dataScreen.currentVideo.video;
          this.cdr.detectChanges();
        },
      });
    });
  }

  override preDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
