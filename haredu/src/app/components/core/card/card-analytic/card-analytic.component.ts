import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'card-analytic',
  templateUrl: './card-analytic.component.html',
  styleUrl: './card-analytic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardAnalyticComponent {
  @Input() title?: string = '';
  @Input() prefix?: string | null = null;
  @Input() value?: string | null = null;
  @Input() suffix?: string | null = null;
  @Input() upTren?: string | number = 0;
  @Input() downTren?: string | number = 0;
  @Input() valueStyle: string = '';
  @Input() titleStyle: string = '';
  @Input() isUppercase = true;
  @Input() customContent: TemplateRef<unknown>;
  @Input() customTitle: TemplateRef<unknown>;
}
