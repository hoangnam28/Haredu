import { ToastService } from '#services/toast.service';
import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit,
  ChangeDetectorRef,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements AfterViewInit {
  @ViewChild('toast', { read: TemplateRef, static: true }) toastTemplate: TemplateRef<object>;
  @ViewChild('close', { read: TemplateRef, static: true }) iconClose: TemplateRef<object>;

  constructor(
    public cdr: ChangeDetectorRef,
    private toastService: ToastService,
  ) {}

  getClass(type: string) {
    return `has-${type}`;
  }

  ngAfterViewInit(): void {
    this.toastService.initTemplate(this.toastTemplate, this.iconClose);
    this.cdr.detectChanges();
  }
}
