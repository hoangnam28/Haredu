import { BaseComponent } from '#components/core/base/base.component';
import { IChangePassword } from '#interfaces/account.interface';
import { UserRepository } from '#repositories/user.repository';
import { ComponentService } from '#services/component.service';
import { LOGO, STRING, VALID_LENGTH } from '#utils/const';
import { jwtIsValid } from '#utils/jwt.helper';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, Validators } from '@angular/forms';
import { PasswordNotEqual, PasswordValidator } from 'src/app/validators/password.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent extends BaseComponent implements OnInit {
  logo = LOGO;
  newPasswordVisible = false;
  confirmNewPasswordVisible = false;
  PASSWORD_MAX_LENGTH = VALID_LENGTH.MAX_LENGTH;
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private userRepository: UserRepository,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
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
    const token = this.queryParams.get(STRING.TOKEN);
    if (!token) {
      this.toastService.error('token.token-is-not-exist');
      return;
    }
    const isValid = jwtIsValid(token);
    if (!isValid) {
      this.toastService.error('token.token-is-invalid-or-expired');
      return;
    }
    const validators = {
      validators: [PasswordNotEqual],
    } as AbstractControlOptions;
    this.formGroup.addValidators(validators.validators!);
    this.formGroup.updateValueAndValidity();
    const form = this.formValue<IChangePassword>();
    const data: IChangePassword = {
      ...form,
      token,
    };

    this.ngSubmit({
      observable: this.userRepository.changePassword(data),
      onSuccess: () => {
        this.componentService.toast.success('toast.changePasswordSuccess');
        this.redirect('/auth/login');
      },
    });
  }
}
