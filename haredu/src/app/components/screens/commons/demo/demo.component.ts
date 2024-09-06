import { FormBuilder } from '@angular/forms';
import { UserRepository } from '#repositories/user.repository';
import { BaseComponent } from '#components/core/base/base.component';
import { ITableConfig, ITableItem, SearchQuery } from '#interfaces/table.interface';
import { ComponentService } from '#services/component.service';
import { PAGE_SIZE } from '#utils/const';
import { TABLE_CONFIG } from '#utils/table.config';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BaseQueryRequest } from '#interfaces/api.interface';
import { toSearchQuery } from '#utils/helpers';
import { TableComponent } from '#components/core/table/table.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoComponent extends BaseComponent implements OnInit {
  @ViewChild('dataTable') table: TableComponent;
  searchInputChange$: Subject<string> = new Subject<string>();
  tableData: { data: ITableItem[]; pageIndex: number; pageSize: number; totalItem: number } = {
    data: [],
    pageIndex: 1,
    pageSize: PAGE_SIZE[0],
    totalItem: 0,
  };
  tableConfig: ITableConfig[] = TABLE_CONFIG.TABLE_USER;
  isLoading = true;
  dialogRef: NzModalRef;
  constructor(
    protected componentService: ComponentService,
    private userRepository: UserRepository,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      search: ['', []],
    });
    this.componentService.handleSearchWithDebounce(this.searchInputChange$, 300, () => {
      this.onSearch();
    });
  }

  ngOnInit(): void {
    this.getUsers({});
    this.subscribeUntilDestroy(this.getControl('search')!.valueChanges, (res) => {
      this.onSearchInputChange(res as string);
    });
  }

  onSearchInputChange(value: string) {
    this.searchInputChange$.next(value);
  }

  async onSearch(data: Partial<SearchQuery> = { pageIndex: 1 }) {
    const { pageIndex, pageSize, sort } = { ...this.tableData, ...this.table.queries, ...data };
    const query = toSearchQuery({ pageIndex, pageSize, sort }, { text: this.formGroup.value.search });
    this.getUsers(query);
  }

  getUsers(params: BaseQueryRequest) {
    this.subscribeOnce(this.userRepository.getAllUser(params), {
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
}
