import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder, Validators } from '@angular/forms';
import { VALID_LENGTH } from '#utils/const';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { UserRepository } from '#repositories/user.repository';
import { AuthRepository } from '#repositories/auth.repository';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent extends BaseComponent implements OnInit {
  oldPasswordVisible = false;
  newPasswordVisible = false;
  confirmNewPasswordVisible = false;
  PASSWORD_MAX_LENGTH = VALID_LENGTH.MAX_LENGTH;
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userRepository: UserRepository,
    private authRepository: AuthRepository,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, PasswordValidator]],
      confirmNewPassword: ['', [Validators.required, PasswordValidator]],
    });
  }

  ngOnInit(): void {}

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.formGroup.value.newPassword !== this.formGroup.value.confirmNewPassword) {
      this.toastService.error('password is not match');
    } else {
      this.subscribeOnce(
        this.userRepository.userChangePasswords({
          oldPassword: this.formGroup.value.oldPassword,
          newPassword: this.formGroup.value.newPassword,
        }),
        {
          onSuccess: (data) => {
            this.formGroup.reset({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
            this.toastService.success('change password Sucess');
          },
          onError: (error) => {},
        },
      );
    }
  }
}
