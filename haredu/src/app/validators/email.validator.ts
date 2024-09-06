import { REGEX } from '#utils/const';
import { AbstractControl } from '@angular/forms';

export function EmailValidator(control: AbstractControl) {
  if (!control.value) return null;

  if (!(control.value || '').match(REGEX.email)) {
    return { email: true };
  }
  return null;
}
