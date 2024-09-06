import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-element',
  templateUrl: './form-element.component.html',
  styleUrl: './form-element.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormElementComponent {
  @Input() label: string;
  @Input() isRequired: boolean = true;
  @Input() justifyLabel: 'between' | 'end' = 'between';
  @Input() labelFor: string;
  @Input() formItemCustomClass = '';

  constructor() {}
}
