import { IBreadcrumbItem } from '#interfaces/index';
import { TranslateService } from '#services/translate.service';
import { BreadcrumbService } from '#services/breadcrumb.service';
import { ChangeDetectionStrategy, Component, ChangeDetectorRef, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadCrumbComponent {
  @Input() isHidden: boolean = false;

  breadcrumb: IBreadcrumbItem[] = [];
  constructor(
    private translateService: TranslateService,
    protected cdr: ChangeDetectorRef,
    protected brcr: BreadcrumbService,
    protected router: Router,
  ) {
    this.brcr.$breadcrumb.subscribe((res: IBreadcrumbItem[]) => {
      if (res) {
        this.breadcrumb = res.filter((item) => item.label !== 'unknown' && item.label);
        this.cdr.markForCheck();
      }
    });
  }

  to(url: string) {
    url && this.router.navigateByUrl(url);
  }

  translateFn = (key: string) => this.translateService.translate(key);
}
