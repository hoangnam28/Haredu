import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lecture-update-detail',
  templateUrl: './lecture-update-detail.component.html',
  styleUrl: './lecture-update-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LectureUpdateDetailComponent extends BaseComponent implements OnInit {
  readonly props = inject(NZ_MODAL_DATA);
  constructor(
    protected componentService: ComponentService,
    private modal: NzModalRef,
  ) {
    super(componentService);
  }

  value: string = '';

  get data() {
    return this.props.data;
  }

  serverUrl = environment.serverUrl;

  ngOnInit(): void {}

  onClickAccept() {
    this.modal.close({ userId: this.data.userId._id, reasonNotVerified: '', isVerified: true, needVerify: false });
  }

  onClickReject() {
    this.modal.close({
      userId: this.data.userId._id,
      reasonNotVerified: this.value,
      isVerified: false,
      needVerify: false,
    });
  }
}
