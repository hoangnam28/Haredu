import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { ComponentService } from '#services/component.service';
import { LoadingService } from '#services/loading.service';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class LoadingComponent extends BaseComponent implements OnInit {
  isLoading = false;
  constructor(
    public ls: LoadingService,
    public cb: ComponentService,
    private cdr: ChangeDetectorRef,
  ) {
    super(cb);
  }

  ngOnInit() {
    this.ls.$isLoading.pipe(distinctUntilChanged()).subscribe((e) => {
      this.isLoading = e;
      this.cdr.detectChanges();
    });
  }
}
