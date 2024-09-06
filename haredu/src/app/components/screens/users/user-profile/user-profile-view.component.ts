import { BaseComponent } from '#components/core/base/base.component';
import { IGender } from '#interfaces/account.interface';
import { UserRepository } from '#repositories/user.repository';
import { ComponentService } from '#services/component.service';
import { UserProfileService } from '#services/user-profile.service';
import { GENDER } from '#utils/const';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile-view',
  templateUrl: './user-profile-view.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileViewComponent extends BaseComponent implements OnInit {
  serverUrl = environment.serverUrl;
  isSubscribed = false;
  subscribeID = '';
  constructor(
    protected componentService: ComponentService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private userRepository: UserRepository,
    private userProfileService: UserProfileService,
  ) {
    super(componentService);
  }

  dataScreen: any;

  get slug() {
    return this.activatedRoute.snapshot.params['slug'];
  }

  teachingFileds: string[] = [];

  ngOnInit(): void {
    this.getOneUser();
  }

  private getOneUser() {
    this.subscribeOnce(this.userRepository.getOneUser(this.slug), {
      onSuccess: (data) => {
        this.dataScreen = data;
        this.getSubscribed();
        this.teachingFileds = data?.detailInfo?.teachingFiledsId?.map((item: any) => item.name);
      },
      onComplete: () => {
        this.cdr.detectChanges();
      },
    });
  }

  onButtonClickDownloadCv(): void {
    window.open(this.serverUrl + this.dataScreen?.detailInfo?.curriculumVitaePath, '_blank');
  }

  handleSubsbcribe(owner: string) {
    if (this.isSubscribed && this.subscribeID) {
      this.subscribeOnce(this.userRepository.unSubscribes(this.subscribeID), {
        onSuccess: () => {
          this.componentService.toast.success('Unsubscribed successfully');
          this.isSubscribed = false;
          this.subscribeID = '';
          this.cdr.detectChanges();
        },
      });
      return;
    }
    this.subscribeOnce(this.userRepository.subscribes({ owner, subscriber: this.userProfileService.currentUser._id }), {
      onSuccess: () => {
        this.componentService.toast.success('Subscribed successfully');
        this.getSubscribed();
      },
    });
  }

  getSubscribed() {
    if (!this.dataScreen._id) return;
    this.subscribeOnce(this.userRepository.getSubscribes(this.dataScreen._id), {
      onSuccess: (res) => {
        if (res.data._id) {
          this.isSubscribed = true;
          this.subscribeID = res.data._id;
        }
        this.cdr.detectChanges();
      },
    });
  }
}
