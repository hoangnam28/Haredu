import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';
import { PAGE_SIZE } from '#utils/const';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ITableConfig, ITableItem, SearchQuery } from '#interfaces/table.interface';
import { TABLE_CONFIG } from '#utils/table.config';
import { TableComponent } from '#components/core/table/table.component';
import { toSearchQuery } from '#utils/helpers';

@Component({
  selector: 'app-report-manage',
  templateUrl: './report-manage.component.html',
  styleUrls: ['./report-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportManageComponent extends BaseComponent implements OnInit {
  @ViewChild('dataTable') table: TableComponent;
  tableData: { data: ITableItem[]; pageIndex: number; pageSize: number; totalItem: number } = {
    data: [],
    pageIndex: 1,
    pageSize: PAGE_SIZE[0],
    totalItem: 0,
  };
  tableConfig: ITableConfig[] = TABLE_CONFIG.TABLE_MANAGE_REPORT;
  isLoading = true;
  fakeDate = new Date();
  dialogRef: NzModalRef;
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
    this.cdr.detectChanges();
  }

  async onSearch(data: Partial<SearchQuery> = { pageIndex: 1 }) {
    const { pageIndex, pageSize, sort } = { ...this.tableData, ...this.table.queries, ...data };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const query = toSearchQuery({ pageIndex, pageSize, sort }, { text: this.formGroup.value.search });
  }
}
