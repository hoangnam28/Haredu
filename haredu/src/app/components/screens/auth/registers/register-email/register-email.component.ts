import { BaseComponent } from '#components/core/base/base.component';
import { IFiled } from '#interfaces/account.interface';
import { AuthRepository } from '#repositories/auth.repository';
import { UserRepository } from '#repositories/user.repository';
import { ComponentService } from '#services/component.service';
import { LOGO, USER_ROLE, USER_ROLE_REGISTER, VALID_LENGTH } from '#utils/const';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from 'src/app/validators/email.validator';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { PhoneValidator } from 'src/app/validators/phone.validator';

@Component({
  selector: 'app-register-email',
  templateUrl: './register-email.component.html',
  styleUrl: './register-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterEmailComponent extends BaseComponent implements OnInit {
  logo = LOGO;
  userRole = USER_ROLE_REGISTER;
  fileds: IFiled[] = [];
  PASSWORD_MAX_LENGTH = VALID_LENGTH.MAX_LENGTH;
  passwordVisible = false;
  confirmPasswordVisible = false;
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userRepository: UserRepository,
    private authRepository: AuthRepository,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      role: [USER_ROLE.STUDENT, [Validators.required]],
      password: ['', [Validators.required, PasswordValidator]],
      email: ['', [Validators.required, EmailValidator]],
      confirmPassword: ['', [Validators.required, PasswordValidator]],
    });
  }

  ngOnInit(): void {
    this.getFields();
  }

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.ngSubmit({
      observable: this.authRepository.register(this.formGroup.value),
      onSuccess: () => {
        this.componentService.toast.success('toast.sendRegisterEmailSucess');
        this.redirect('/auth/login');
      },
    });
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
