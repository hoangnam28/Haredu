import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';
import { PAGE_SIZE, USER_ROLE } from '#utils/const';
import { IAccount } from '#interfaces/account.interface';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ITableConfig, ITableItem, SearchQuery } from '#interfaces/table.interface';
import { TABLE_CONFIG } from '#utils/table.config';
import { TableComponent } from '#components/core/table/table.component';
import { toSearchQuery } from '#utils/helpers';
import { LectureUpdateDetailComponent } from '#components/core/modal/lecture-update-detail/lecture-update-detail.component';
import { UserRepository } from '#repositories/user.repository';

@Component({
  selector: 'app-lecture-update',
  templateUrl: './lecture-update.component.html',
  styleUrls: ['./lecture-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LectureUpdateComponent extends BaseComponent implements OnInit {
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userRepository: UserRepository,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      search: ['', []],
    });
  }

  tableData: any[];

  ngOnInit(): void {
    this.getTutorNeedVerify();
  }

  private getTutorNeedVerify() {
    this.subscribeOnce(this.userRepository.getTutorNeedVerify(), {
      onSuccess: (data) => {
        this.tableData = data;
      },
      onComplete: () => {
        this.cdr.detectChanges();
      },
    });
  }

  openViewDetail(id: string) {
    const dialogRef = this.dialogService.open(LectureUpdateDetailComponent, {
      title: 'Detailed update information',
      footer: null,
      closable: true,
      width: '600px',
      data: this.tableData.find((item) => (item._id = id)),
    });

    dialogRef.afterClose.subscribe((data) => {
      if (data) {
        this.subscribeOnce(this.userRepository.updateTutorNeedVerify(data), {
          onSuccess: () => {
            this.getTutorNeedVerify();
          },
          onComplete: () => {
            this.cdr.detectChanges();
          },
        });
      }
    });
  }
}
