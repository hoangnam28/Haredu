import { REGEX, VALIDATOR_ERROR } from '#utils/const';
import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * This only compare password and new-password
 */
export function PasswordNotEqual(parent: AbstractControl) {
  if (!parent) return;

  const newPassword = parent.get('newPassword')!;
  const confirmPassword = parent.get('confirmNewPassword')!;
  const isPasswordNotEqual = newPassword.value !== confirmPassword.value && newPassword.value && confirmPassword.value;

  if (isPasswordNotEqual) {
    newPassword.setErrors({ ...newPassword.errors, [VALIDATOR_ERROR.PASSWORD_NOT_EQUAL]: true });
    confirmPassword.setErrors({ ...confirmPassword.errors, [VALIDATOR_ERROR.PASSWORD_NOT_EQUAL]: true });
    return;
  }

  newPassword.setErrors(removeEqualValidator(newPassword.errors, VALIDATOR_ERROR.PASSWORD_NOT_EQUAL));
  confirmPassword.setErrors(removeEqualValidator(confirmPassword.errors, VALIDATOR_ERROR.PASSWORD_NOT_EQUAL));
}

export function ConfirmPasswordNotEqual(parent: AbstractControl) {
  if (!parent) return;

  const password = parent.get('password')!;
  const confirmPassword = parent.get('confirmPassword')!;
  const isPasswordNotEqual = password.value !== confirmPassword.value && password.value && confirmPassword.value;

  if (isPasswordNotEqual) {
    password.setErrors({ ...password.errors, [VALIDATOR_ERROR.CONFIRM_PASSWORD_NOT_EQUAL]: true });
    confirmPassword.setErrors({ ...confirmPassword.errors, [VALIDATOR_ERROR.CONFIRM_PASSWORD_NOT_EQUAL]: true });
    return;
  }

  password.setErrors(removeEqualValidator(password.errors, VALIDATOR_ERROR.CONFIRM_PASSWORD_NOT_EQUAL));
  confirmPassword.setErrors(removeEqualValidator(confirmPassword.errors, VALIDATOR_ERROR.CONFIRM_PASSWORD_NOT_EQUAL));
}

function removeEqualValidator(errors: ValidationErrors | null, type: string): ValidationErrors | null {
  if (!errors) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [type]: equal, ...rest } = errors;

  if (Object.values(rest).length) return rest;

  return null;
}

export function OldPasswordEqual(parent: AbstractControl) {
  if (!parent) return;

  const oldPassword = parent.get('oldPassword')!;
  const newPassword = parent.get('newPassword')!;
  const passwordNotEqual = oldPassword.value === newPassword.value && oldPassword.value && newPassword.value;

  if (passwordNotEqual) {
    oldPassword.setErrors({ ...oldPassword.errors, [VALIDATOR_ERROR.OLD_PASSWORD_EQUAL]: true });
    newPassword.setErrors({ ...newPassword.errors, [VALIDATOR_ERROR.OLD_PASSWORD_EQUAL]: true });
    return;
  }

  oldPassword.setErrors(removeEqualValidator(oldPassword.errors, VALIDATOR_ERROR.OLD_PASSWORD_EQUAL));
  newPassword.setErrors(removeEqualValidator(newPassword.errors, VALIDATOR_ERROR.OLD_PASSWORD_EQUAL));
}

export function PasswordValidator(control: AbstractControl) {
  if (!control.value) return null;

  const isValid = control.value && control.value.match(REGEX.password);
  if (!isValid) {
    return { password: true };
  }
  return null;
}
