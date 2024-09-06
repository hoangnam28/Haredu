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
import { UserProfileService } from '#services/user-profile.service';
import { IAccount } from '#interfaces/account.interface';
import { SOCKET_SCREEN_ACTION } from '#utils/const';

@Component({
  selector: 'app-video-demo',
  templateUrl: './video-demo.component.html',
  styleUrls: ['./video-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoDemoComponent extends BaseComponent implements OnInit {
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userRepository: UserRepository,
    private videoRepository: VideoRepository,
    private userProfileService: UserProfileService,
  ) {
    super(componentService);
  }
  listOfColumns: any[];
  listOfData: any[];
  serverUrl = environment.serverUrl;

  trackByName(_: number, item: any): string {
    return item.name;
  }

  user: IAccount;

  ngOnInit(): void {
    this.getMyVideo();
    this.getFields();
    this.getMe();
  }

  private getMe() {
    this.subscribeOnce(this.userRepository.getMe(), {
      onSuccess: (res) => {
        this.user = res.data;
      },
    });
  }

  private getMyVideo() {
    this.subscribeOnce(this.videoRepository.getMyVideo(), {
      onSuccess: (data) => {
        this.listOfData = data.map((item: any) => ({
          thumbnail: this.serverUrl + item.thumbnail,
          name: item.name,
          categoryName: item.teachingFiledId.name,
          categoryId: item.teachingFiledId._id,
          createTime: this.convertToDatetime(item.createdAt),
          view: item.view,
          href: `videos/${item._id}`,
          id: item._id,
          description: item.description,
        }));
        this.cdr.detectChanges();
      },
      onComplete: () => {
        this.cdr.detectChanges();
      },
    });
  }

  private getFields() {
    this.subscribeOnce(this.userRepository.getFields({}), {
      onSuccess: (data: any[]) => {
        this.listOfColumns = [
          {
            name: 'Video',
          },
          {
            name: 'Category',
            sortFn: (a: any, b: any) => a.categoryName.localeCompare(b.categoryName),
            listOfFilter: data.map((item) => ({ text: item.name, value: item.name })),
            filterFn: (list: string[], item: any) => list.some((name) => item.categoryName.indexOf(name) !== -1),
          },
          {
            name: 'Create Time',
            sortOrder: null,
            sortFn: (a: any, b: any) => a.age - b.age,
          },
          {
            name: 'View',
            sortOrder: null,
            sortFn: (a: any, b: any) => a.age - b.age,
          },
          {
            name: 'Action',
          },
        ];

        this.cdr.detectChanges();
      },
      onComplete: () => {
        this.cdr.detectChanges();
      },
    });
  }

  private delete(id: string, name: string) {
    this.dialogService.confirm(this.translate.translate('Bạn có muốn Xóa video ' + name), {
      onOk: () => {
        this.subscribeOnce(this.videoRepository.delete(id), {
          onSuccess: (data) => {
            this.getMyVideo();
            this.toastService.success(`Delete successfully`);
            this.cdr.detectChanges();
          },
          onComplete: () => {
            this.cdr.detectChanges();
          },
        });
      },
      onCancel: () => {},
    });
  }

  onDeleteVideo(id: string, name: string) {
    this.delete(id, name);
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.toastService.success(`${info.file.name} file uploaded successfully`);
      this.socket.sendMessage(SOCKET_SCREEN_ACTION.SEND_NOTIFY, {
        title: ' upload new video',
        owner: this.userProfileService.currentUser._id,
        link: `/users/video-demo/${this.userProfileService.currentUser.slug}`,
      });
      this.getMyVideo();
    } else if (info.file.status === 'error') {
      this.toastService.error(`${info.file.name} file upload failed.`);
    }
  }

  onOpenVideoUpdateComponent(data: any) {
    const dialogRef: NzModalRef = this.dialogService.open(VideoUpdateComponent, {
      title: this.translate.translate('Update Video'),
      footer: null,
      closable: true,
      width: '1200px',
      data,
    });

    dialogRef.afterClose.subscribe((data) => {
      if (data) this.getMyVideo();
    });
  }
}
