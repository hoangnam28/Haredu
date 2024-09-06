import { UserRepository } from '#repositories/user.repository';
import { FormBuilder, Validators } from '@angular/forms';
import { ComponentService } from '#services/component.service';
import { BaseComponent } from '#components/core/base/base.component';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LOGO, USER_ROLE, USER_ROLE_REGISTER, VALID_LENGTH } from '#utils/const';
import { PhoneValidator } from 'src/app/validators/phone.validator';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IFiled } from '#interfaces/account.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent extends BaseComponent implements OnInit {
  safeUrl: SafeResourceUrl;
  logo = LOGO;
  userRole = USER_ROLE_REGISTER;
  studentStep: string[] = ['1', '2', '3', '4'];
  lectureStep: string[] = ['1', '2', '3', '4', '5'];
  steps: string[] = this.lectureStep;
  currentStep = 0;
  isShowOtp = false;
  loading = false;
  avatarUrl?: string;
  PASSWORD_MAX_LENGTH = VALID_LENGTH.MAX_LENGTH;
  passwordVisible = false;
  confirmPasswordVisible = false;
  fileds: IFiled[] = [];
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private sanitizer: DomSanitizer,
    private userRepository: UserRepository,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      role: [USER_ROLE.TUTOR, [Validators.required]],
      phone: ['', [Validators.required, PhoneValidator]],
      otp: ['', [Validators.required]],
      fileds: [[], [Validators.required]],
      cidFront: ['', [Validators.required]],
      cidBack: ['', [Validators.required]],
      avatar: ['', [Validators.required]],
      cv: ['', [Validators.required]],
      password: ['', [Validators.required, PasswordValidator]],
      confirmPassword: ['', [Validators.required, PasswordValidator]],
    });
  }
  ngOnInit(): void {
    this.subscribeUntilDestroy(this.getControl('role')!.valueChanges, (res) => {
      if (res === USER_ROLE.STUDENT) {
        this.steps = this.studentStep;
      } else {
        this.steps = this.lectureStep;
      }
      this.currentStep = 0;
    });
    this.getFields();
  }

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  onNextStep() {
    if (this.currentStep === 1 && this.getControl('phone')?.invalid) {
      this.componentService.toast.warning('toast.invalidPhone');
      return;
    }
    if (this.currentStep < this.steps.length - 1) this.currentStep++;
    this.isShowOtp = false;
  }

  onBackStep() {
    if (this.currentStep > 0) this.currentStep--;
    this.isShowOtp = false;
  }

  onSubmit(event: Event) {
    event.preventDefault();
  }

  sendOtp() {
    this.isShowOtp = true;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeUploadCv = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isLt10M = file.size! / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.msg.error('File must be smaller than 10MB!');
        observer.complete();
        return;
      }
      observer.next(isLt10M);
      observer.complete();
    });

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChangeFront(info: { file: NzUploadFile }): void {
    this.getBase64(info.file!.originFileObj!, (img: string) => {
      this.loading = false;
      this.formGroup.patchValue({
        cidFront: img,
      });
    });
  }

  handleChangeBack(info: { file: NzUploadFile }): void {
    this.getBase64(info.file!.originFileObj!, (img: string) => {
      this.loading = false;
      this.formGroup.patchValue({
        cidBack: img,
      });
    });
  }

  handleChangeAvatar(info: { file: NzUploadFile }): void {
    this.getBase64(info.file!.originFileObj!, (img: string) => {
      this.loading = false;
      this.formGroup.patchValue({
        avatar: img,
      });
    });
  }

  handleChangeCv(info: NzUploadChangeParam): void {
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
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
