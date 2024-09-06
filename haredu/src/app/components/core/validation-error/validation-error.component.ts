/* eslint-disable max-lines-per-function */
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { TranslateService } from '#services/translate.service';
import { VALIDATOR_ERROR } from '#utils/const';

@Component({
  selector: 'app-validation-error',
  templateUrl: './validation-error.component.html',
  styleUrls: ['./validation-error.component.scss'],
})
export class ValidationErrorComponent {
  @Input() control: FormControl;

  constructor(private translate: TranslateService) {}

  getMessage() {
    const formGroup = this.control.parent;
    if (!formGroup) return '';
    const errors = this.control.errors;

    const controlName = Object.keys(formGroup.controls).find(
      (name) => (formGroup.controls as { [key: string]: AbstractControl })[name] === this.control,
    );

    if (!this.control || !errors) return '';

    if (errors.required)
      return this.translate.translate('validation.require', {
        controlName: this.translate.translate(`form.validation.${controlName}`),
      });

    if (errors.minlength) return this.translate.translate('validation.require');

    if (errors.maxlength) return this.translate.translate('validation.require');

    if (errors.email) return this.translate.translate('validation.email');

    if (errors.domain) return this.translate.translate('validation.domain');

    if (errors.phone) return this.translate.translate('validation.phone');

    if (errors.inValidLength) {
      return this.translate.translate('validation.length', {
        min: errors.min,
        max: errors.max,
      });
    }

    if (errors[VALIDATOR_ERROR.OLD_PASSWORD_EQUAL]) return this.translate.translate('validation.old-password-equal');

    if (errors[VALIDATOR_ERROR.PASSWORD_NOT_EQUAL]) return this.translate.translate('validation.password-not-equal');
    if (errors[VALIDATOR_ERROR.VALIDATION_REQUIRE]) {
      return this.translate.translate('validation.require', {
        controlName: this.translate.translate(`form.validation.${controlName}`),
      });
    }
    if (errors[VALIDATOR_ERROR.CONFIRM_PASSWORD_NOT_EQUAL])
      return this.translate.translate('validation.confirm-password-not-equal');

    if (errors.password) return this.translate.translate('validation.password');

    if (errors.min)
      return this.translate.translate('validation.min', {
        controlName: this.translate.translate(`form.validation.${controlName}`),
        min: errors.min.min,
      });

    return '';
  }
}
