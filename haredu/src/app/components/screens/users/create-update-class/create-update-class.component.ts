import { UserRepository } from './../../../../repositories/user.repository';
import { BaseComponent } from '#components/core/base/base.component';
import { IFiled } from '#interfaces/account.interface';
import { ComponentService } from '#services/component.service';
import { INIT_TINY_EDITOR } from '#utils/const';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClassroomRepository } from '#repositories/classroom.repository';
import { ICreateClassroom } from '#interfaces/class.interface';
import { backHistoryPage } from '#utils/helpers';

@Component({
  selector: 'app-create-update-class',
  templateUrl: './create-update-class.component.html',
  styleUrl: './create-update-class.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUpdateClassComponent extends BaseComponent implements OnInit {
  serverUrl = environment.serverUrl;
  apiUrl = environment.apiUrl;
  tinyKey = environment.TINY_MCE_API_KEY;
  init = INIT_TINY_EDITOR;
  fileds: IFiled[] = [];
  banner: string = '';
  thumbnail: string = '';
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userRepository: UserRepository,
    private classroomRepository: ClassroomRepository,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      thumbnail: ['', [Validators.required]],
      banner: ['', [Validators.required]],
      description: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      teachFileds: [[], [Validators.required]],
      date: [[], [Validators.required]],
      price: [0, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getFields();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const data: ICreateClassroom = {
      name: this.formGroup.value.name as string,
      thumbnail: this.thumbnail,
      banner: this.banner,
      description: this.formGroup.value.description as string,
      startTime: this.formGroup.value.startTime as Date,
      endTime: this.formGroup.value.endTime as Date,
      teachFileds: this.formGroup.value.teachFileds as string[],
      price: this.formGroup.value.price as number,
    };
    this.ngSubmit({
      observable: this.classroomRepository.createClass(data),
      onSuccess: (res) => {
        this.componentService.toast.success('toast.create-success-message');
        this.redirect(`/users/my-classes/create/set-up/${res.data._id}`);
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
      const isImage = file.type ? file.type.startsWith('image/') : false;
      if (!isImage) {
        this.componentService.toast.error('toast.onlyImage');
        observer.complete();
        return;
      }
      const isLt20M = file.size! / 1024 / 1024 < 2;
      if (!isLt20M) {
        this.componentService.toast.error('toast.imageSize');
        observer.complete();
        return;
      }
      observer.next(isImage && isLt20M);
      observer.complete();
    });

  handleChange(info: { file: NzUploadFile }, controlName: string): void {
    switch (info.file.status) {
      case 'done':
        this.componentService.toast.success('toast.uploadImageSuccess');
        this.formGroup.controls[controlName].setValue(this.serverUrl + info.file.response.data[0].imageUrl);
        if (controlName === 'thumbnail') {
          this.thumbnail = info.file.response.data[0]._id;
        } else {
          this.banner = info.file.response.data[0]._id;
        }
        break;
      case 'error':
        this.componentService.toast.error('toast.uploadImageFail');
        break;
    }
  }

  onChangeDate(result: Date[]): void {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    if (result[0] < today) {
      this.componentService.toast.warning('Vui lòng chọn thời gian bắt lớn hơn ngày mai');
      this.formGroup.patchValue({
        date: [],
      });
      this.cdr.detectChanges();
      return;
    }
    this.formGroup.patchValue({
      startTime: result[0],
      endTime: result[1],
    });
    this.cdr.detectChanges();
  }

  getFields() {
    this.subscribeOnce(this.userRepository.getFields({}), {
      onSuccess: (response) => {
        this.fileds = response;
        this.cdr.detectChanges();
      },
    });
  }
}
