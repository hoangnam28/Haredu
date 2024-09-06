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
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent extends BaseComponent implements OnInit {
  serverUrl = environment.serverUrl;
  constructor(
    protected componentService: ComponentService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private msg: NzMessageService,
    private activetedRoute: ActivatedRoute,
    private userRepository: UserRepository,
    private userProfileService: UserProfileService,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      dob: [null, [Validators.required]],
      avatar: [null, [Validators.required]],
      slug: [null, [Validators.required]],
      identityCardFront: [null, [Validators.required]],
      identityCardBack: [null, [Validators.required]],
    });
    this.formGroupUserOrg = this.formBuilder.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      dob: [null, [Validators.required]],
      avatar: [null, [Validators.required]],
      slug: [null, [Validators.required]],
      identityCardFront: [null, [Validators.required]],
      identityCardBack: [null, [Validators.required]],
    });
  }
  private formGroupUserOrg: FormGroup;
  genders: IGender[] = GENDER;
  loading = false;
  isEdited: boolean = false;
  fileList: NzUploadFile[] = [];
  cvPath: string = '';
  teachingFileds: string[] = [];
  dataScreen: any;

  get user() {
    return this.userProfileService.currentUser;
  }

  isEditMode: boolean = false;

  ngOnInit(): void {
    this.getOwnUser();
  }

  private getOwnUser() {
    this.subscribeOnce(this.userRepository.getOwnUser(), {
      onSuccess: (data) => {
        this.formGroup.patchValue({
          email: data?.email,
          name: data?.name,
          gender: data?.gender,
          dob: data?.dob,
          slug: data?.slug,
          avatar: this.serverUrl + data?.avatar,
          identityCardFront: this.serverUrl + data?.detailInfo?.identityCardFront,
          identityCardBack: this.serverUrl + data?.detailInfo?.identityCardBack,
        });
        this.formGroupUserOrg.patchValue({
          email: data?.email,
          name: data?.name,
          gender: data?.gender,
          dob: data?.dob,
          slug: data?.slug,
          avatar: this.serverUrl + data?.avatar,
          identityCardFront: this.serverUrl + data?.detailInfo?.identityCardFront,
          identityCardBack: this.serverUrl + data?.detailInfo?.identityCardBack,
        });
        if (this.user._id === data._id) this.isEditMode = true;
        this.dataScreen = data;
        this.cvPath = this.serverUrl + data.detailInfo?.curriculumVitaePath;
        this.teachingFileds = data?.detailInfo?.teachingFiledsId?.map((item: { name: string }) => item?.name);
        this.cdr.detectChanges();
      },
      onComplete: () => {
        // this.auth.endSession();
      },
    });
  }

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('File must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isLt2M);
      observer.complete();
    });

  onButtonClickDiscard() {
    this.dialogService.confirm(this.translate.translate('Bạn có muốn hủy thông tin vừa chỉnh sửa'), {
      onOk: () => {
        this.formGroup.reset(this.formGroupUserOrg.getRawValue());
      },
      onCancel: () => {},
    });
  }

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
    }
    if (status === 'done') {
      this.toastService.success('Upload file success');
      this.getOwnUser();
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed., require pdf file`);
      // Xóa file khỏi danh sách khi upload thất bại
      this.fileList = [];
    }
  }

  onButtonClickDownloadCv(): void {
    window.open(this.cvPath, '_blank');
  }

  onButtonClicSave(): void {
    this.ngSubmit({
      observable: this.userRepository.update(this.formGroup.value),
      onSuccess: (response) => {
        this.getOwnUser();
        this.componentService.toast.success('Cập nhật thành công');
      },
      // eslint-disable-next-line @typescripta-eslint/no-explicit-any
    });
  }
}
