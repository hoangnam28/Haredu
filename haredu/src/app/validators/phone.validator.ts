import { REGEX } from '#utils/const';
import { AbstractControl } from '@angular/forms';

export function PhoneValidator(control: AbstractControl) {
  if (!control.value) return null;

  if (!(control.value || '').match(REGEX.phoneNumber)) {
    return { phone: true };
  }
  return null;
}
