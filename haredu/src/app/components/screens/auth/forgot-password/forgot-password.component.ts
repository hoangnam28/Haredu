import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { VALID_LENGTH } from '#utils/const';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { PhoneValidator } from 'src/app/validators/phone.validator';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent extends BaseComponent implements OnInit {
  PASSWORD_MAX_LENGTH = VALID_LENGTH.MAX_LENGTH;
  passwordVisible = false;
  confirmPasswordVisible = false;
  currentStep = 0;
  steps: string[] = ['1', '2'];
  isShowOtp = false;
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      phone: ['', [Validators.required, PhoneValidator]],
      otp: ['', [Validators.required]],
      password: ['', [Validators.required, PasswordValidator]],
      confirmPassword: ['', [Validators.required, PasswordValidator]],
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
  }

  onNextStep() {
    if (this.currentStep === 0 && this.getControl('phone')?.invalid) {
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

  sendOtp() {
    if (this.getControl('phone')?.valid) this.isShowOtp = true;
  }
}
