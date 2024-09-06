import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input',
})
export class AutoTrimDirective {
  onInput = new Event('input');
  constructor(private el: ElementRef) {
    this.input.setAttribute('autocomplete', 'off');
  }

  @HostListener('blur') onBlur() {
    const value = this.input.value;
    const valueTrim = value.trim();
    if (value !== valueTrim) {
      this.input.value = valueTrim;
      this.input.dispatchEvent(this.onInput);
    }
  }

  get input(): HTMLInputElement {
    return this.el.nativeElement;
  }
}
