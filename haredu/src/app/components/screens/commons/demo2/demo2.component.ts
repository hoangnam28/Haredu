import { BaseComponent } from '#components/core/base/base.component';
import { CreateDemoComponent } from '#components/core/modal/create-demo/create-demo.component';
import { TableComponent } from '#components/core/table/table.component';
import { BaseQueryRequest } from '#interfaces/api.interface';
import { ICreateDemo } from '#interfaces/demo.interface';
import { ITableConfig, ITableItem, SearchQuery } from '#interfaces/table.interface';
import { DemoRepository } from '#repositories/demo.repository';
import { ComponentService } from '#services/component.service';
import { PAGE_SIZE } from '#utils/const';
import { toSearchQuery } from '#utils/helpers';
import { TABLE_CONFIG } from '#utils/table.config';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-demo2',
  templateUrl: './demo2.component.html',
  styleUrl: './demo2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Demo2Component extends BaseComponent implements OnInit {
  @ViewChild('dataTable') table: TableComponent;
  searchInputChange$: Subject<string> = new Subject<string>();
  tableData: { data: ITableItem[]; pageIndex: number; pageSize: number; totalItem: number } = {
    data: [],
    pageIndex: 1,
    pageSize: PAGE_SIZE[0],
    totalItem: 0,
  };
  tableConfig: ITableConfig[] = TABLE_CONFIG.TABLE_DEMO;
  isLoading = true;
  dialogRef: NzModalRef;
  constructor(
    protected componentService: ComponentService,
    private demoRepository: DemoRepository,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      search: ['', []],
    });
    this.componentService.handleSearchWithDebounce(this.searchInputChange$, 500, () => {
      this.onSearch();
    });
  }

  ngOnInit(): void {
    this.getAllDemoData({});
    this.subscribeUntilDestroy(this.getControl('search')!.valueChanges, () => {
      this.onSearchInputChange();
    });
  }

  getAllDemoData(params: BaseQueryRequest) {
    this.subscribeOnce(this.demoRepository.getAllDemo(params), {
      onSuccess: (response) => {
        this.tableData = {
          data: response.records,
          pageIndex: response.page,
          pageSize: response.size,
          totalItem: response.total,
        };
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSearchInputChange() {
    this.searchInputChange$.next('');
  }

  async onSearch(data: Partial<SearchQuery> = { pageIndex: 1 }) {
    const { pageIndex, pageSize, sort } = { ...this.tableData, ...this.table.queries, ...data };
    const query = toSearchQuery({ pageIndex, pageSize, sort }, { text: this.formGroup.value.search });
    this.getAllDemoData(query);
  }

  openCreate() {
    this.dialogRef = this.dialogService.open(CreateDemoComponent, {
      title: 'Create Demo',
      footer: null,
      closable: true,
      width: '600px',
      data: {
        isCreated: true,
      },
    });

    this.dialogRef.afterClose.subscribe((isReload) => {
      isReload && this.getAllDemoData({});
    });
  }

  openUpdate(data: ICreateDemo) {
    this.dialogRef = this.dialogService.open(CreateDemoComponent, {
      title: 'Create Demo',
      footer: null,
      closable: true,
      width: '600px',
      data: {
        data,
        isCreated: false,
      },
    });

    this.dialogRef.afterClose.subscribe((isReload) => {
      isReload && this.getAllDemoData({});
    });
  }
}
