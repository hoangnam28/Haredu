import { DNS_TYPE_ENUM, DnsType, REGEX, VALIDATOR_ERROR } from '#utils/const';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function DomainValidator(control: AbstractControl) {
  if (!control.value) return null;

  if (!(control.value || '').match(REGEX.domain)) {
    return { domain: true };
  }
  return null;
}

export function DnsRecordValidator(dnsType: DnsType) {
  return (parent: AbstractControl) => {
    if (!parent) return;
    const content = parent.get('content')!;
    const name = parent.get('name')!;
    const priority = parent.get('priority')!;
    const tag = parent.get('tag')!;
    const port = parent.get('port')!;
    const target = parent.get('target')!;
    const value = parent.get('value')!;
    const weight = parent.get('weight')!;
    if (!name.value) name.setErrors({ ...name.errors, [VALIDATOR_ERROR.VALIDATION_REQUIRE]: true });

    if (![DNS_TYPE_ENUM.SRV, DNS_TYPE_ENUM.CAA].includes(dnsType as DNS_TYPE_ENUM)) {
      if (!content.value) content.setErrors({ ...content.errors, [VALIDATOR_ERROR.VALIDATION_REQUIRE]: true });
    }
    switch (dnsType) {
      case DNS_TYPE_ENUM.CAA:
        if (!tag.value) tag.setErrors({ ...tag.errors, [VALIDATOR_ERROR.VALIDATION_REQUIRE]: true });
        if (!value.value) value.setErrors({ ...value.errors, [VALIDATOR_ERROR.VALIDATION_REQUIRE]: true });
        break;
      case DNS_TYPE_ENUM.MX:
        if (!priority.value) priority.setErrors({ ...priority.errors, [VALIDATOR_ERROR.VALIDATION_REQUIRE]: true });
        break;
      case DNS_TYPE_ENUM.SRV:
        [priority, weight, port, target].map(
          (item) => !item.value && item.setErrors({ ...item.errors, [VALIDATOR_ERROR.VALIDATION_REQUIRE]: true }),
        );
        break;
    }
    return;
  };
}

export function removeRequiredValidator(errors: ValidationErrors | null, type: string): ValidationErrors | null {
  if (!errors) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [type]: equal, ...rest } = errors;

  if (Object.values(rest).length) return rest;

  return null;
}
