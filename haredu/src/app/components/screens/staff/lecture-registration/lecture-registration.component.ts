import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';
import { ITableConfig, ITableItem, SearchQuery } from '#interfaces/table.interface';
import { TABLE_CONFIG } from '#utils/table.config';
import { PAGE_SIZE, USER_ROLE } from '#utils/const';
import { TableComponent } from '#components/core/table/table.component';
import { toSearchQuery } from '#utils/helpers';
import { IAccount } from '#interfaces/account.interface';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { LectureDetailComponent } from '#components/core/modal/lecture-detail/lecture-detail.component';

@Component({
  selector: 'app-lecture-registration',
  templateUrl: './lecture-registration.component.html',
  styleUrls: ['./lecture-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LectureRegistrationComponent extends BaseComponent implements OnInit {
  @ViewChild('dataTable') table: TableComponent;
  tableData: { data: ITableItem[]; pageIndex: number; pageSize: number; totalItem: number } = {
    data: [],
    pageIndex: 1,
    pageSize: PAGE_SIZE[0],
    totalItem: 0,
  };
  tableConfig: ITableConfig[] = TABLE_CONFIG.TABLE_LECTURE_REGISTRATION;
  isLoading = true;
  fakeDate = new Date();
  dialogRef: NzModalRef;
  fakeData: IAccount[] = [
    {
      _id: 'c7c02c5a-5b57-4b45-90cc-d64a769a0071',
      name: 'John Doe',
      phone: '123-456-7890',
      email: 'john.doe@example.com',
      password: 'password123',
      role: USER_ROLE.TUTOR,
      isActive: true,
      deletedAt: null,
      status: true,
    },
  ];
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      search: ['', []],
    });
  }

  ngOnInit(): void {
    this.tableData.data = this.fakeData;
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }
  async onSearch(data: Partial<SearchQuery> = { pageIndex: 1 }) {
    const { pageIndex, pageSize, sort } = { ...this.tableData, ...this.table.queries, ...data };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const query = toSearchQuery({ pageIndex, pageSize, sort }, { text: this.formGroup.value.search });
  }

  openViewDetail() {
    this.dialogRef = this.dialogService.open(LectureDetailComponent, {
      title: 'Detailed registration information',
      footer: null,
      closable: true,
      width: '600px',
      data: {
        isCreated: true,
      },
    });

    this.dialogRef.afterClose.subscribe(() => {});
  }
}
