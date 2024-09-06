import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';
import { ITableConfig, ITableItem, SearchQuery } from '#interfaces/table.interface';
import { toSearchQuery } from '#utils/helpers';
import { PAGE_SIZE, USER_ROLE } from '#utils/const';
import { TABLE_CONFIG } from '#utils/table.config';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { IAccount } from '#interfaces/account.interface';
import { TableComponent } from '#components/core/table/table.component';
import { MappingNameRoleByRoles } from 'src/app/config/sidebar.config';

@Component({
  selector: 'app-post-manage',
  templateUrl: './post-manage.component.html',
  styleUrls: ['./post-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostManageComponent extends BaseComponent implements OnInit {
  @ViewChild('dataTable') table: TableComponent;
  tableData: { data: ITableItem[]; pageIndex: number; pageSize: number; totalItem: number } = {
    data: [],
    pageIndex: 1,
    pageSize: PAGE_SIZE[0],
    totalItem: 0,
  };
  tableConfig: ITableConfig[] = TABLE_CONFIG.TABLE_MANAGE_ARTICLE;
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

  getRoleName(role: USER_ROLE): string {
    return MappingNameRoleByRoles[role];
  }
  async onSearch(data: Partial<SearchQuery> = { pageIndex: 1 }) {
    const { pageIndex, pageSize, sort } = { ...this.tableData, ...this.table.queries, ...data };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const query = toSearchQuery({ pageIndex, pageSize, sort }, { text: this.formGroup.value.search });
  }
}
