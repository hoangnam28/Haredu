import { STRING } from '#utils/const';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NzButtonGroupSize } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent implements OnInit {
  @Input() type: 'primary' | 'dashed' | 'link' | 'text' | 'default' = 'default';
  @Input() btnType: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon: string;
  @Input() label: string;
  @Input() ngClass: string;
  @Input() align: 'left' | 'right' | 'center' = 'center';
  @Input() fullWidth = false;
  @Input() active = false;
  @Input() iconPosition: STRING.PREFIX | STRING.SUFFIX | string = STRING.PREFIX;
  @Input() svgIcon: string = '';
  @Input() size: NzButtonGroupSize;
  @Input() width = '';
  @Input() height: string = '40px';
  @Input() disable: boolean = false;
  @Input() fontSize = '14px';
  @Input() nzDanger = false;

  get isPrefix(): boolean {
    return this.iconPosition === STRING.PREFIX;
  }

  ngOnInit(): void {
    this.btnType === 'submit' ? (this.fontSize = '16px') : '14px';
  }
}
