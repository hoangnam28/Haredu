import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';
import { TableComponent } from '#components/core/table/table.component';
import { ITableConfig, ITableItem, SearchQuery } from '#interfaces/table.interface';
import { DATE_RANGE, PAGE_SIZE } from '#utils/const';
import { TABLE_CONFIG } from '#utils/table.config';
import { toSearchQuery } from '#utils/helpers';
import { UserRepository } from '#repositories/user.repository';
import { BaseQueryRequest } from '#interfaces/api.interface';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionHistoryComponent extends BaseComponent implements OnInit {
  @ViewChild('dataTable') table: TableComponent;
  tableData: { data: ITableItem[]; pageIndex: number; pageSize: number; totalItem: number } = {
    data: [],
    pageIndex: 1,
    pageSize: PAGE_SIZE[0],
    totalItem: 0,
  };
  tableConfig: ITableConfig[] = TABLE_CONFIG.TABLE_TRANSACTION_HISTORY;
  isLoading = true;
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userRepository: UserRepository,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      from: DATE_RANGE.TODAY[0],
      to: DATE_RANGE.TODAY[1],
      plusMoney: false,
      minusMoney: false,
    });
  }

  ngOnInit(): void {
    this.formGroup.valueChanges.subscribe((val) => {
      this.onSearch();
    });
  }

  async onSearch(data: Partial<SearchQuery> = { pageIndex: 1 }) {
    const { pageIndex, pageSize, sort } = { ...this.tableData, ...this.table.queries, ...data };
    const query = toSearchQuery(
      { pageIndex, pageSize, sort },
      {
        from: this.formGroup.value.from,
        to: this.formGroup.value.to,
        plus: this.formGroup.value.plusMoney,
        minus: this.formGroup.value.minusMoney,
      },
    );
    this.getAllTransaction(query);
  }

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  getAllTransaction(params: BaseQueryRequest) {
    this.subscribeOnce(this.userRepository.getAllTransaction(params), {
      onSuccess: (response) => {
        this.tableData = {
          data: response.records,
          pageIndex: response.page,
          pageSize: response.size,
          totalItem: response.total,
        };
      },
      onComplete: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  dateRangeChanged(dateRange: Date[]) {
    console.log('🚀 ~ TransactionHistoryComponent ~ dateRangeChanged ~ dateRange:', dateRange);
    this.formGroup.patchValue({
      from: dateRange[0],
      to: dateRange[1],
    });
  }
}
