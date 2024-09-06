import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';
import { BaseQueryRequest } from '#interfaces/api.interface';
import { UserRepository } from '#repositories/user.repository';
import { ITableConfig, ITableItem, SearchQuery } from '#interfaces/table.interface';
import { TABLE_CONFIG } from '#utils/table.config';
import { TableComponent } from '#components/core/table/table.component';
import { DATE_RANGE, PAGE_SIZE } from '#utils/const';
import { toSearchQuery } from '#utils/helpers';
import { BankRepository } from '#repositories/bank.repository';
import { IQrCodeBank } from '#interfaces/transaction.interface';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { QrcodeModalComponent } from '../qrcode-modal/qrcode-modal.component';

@Component({
  selector: 'app-lecture-withdraw',
  templateUrl: './lecture-withdraw.component.html',
  styleUrls: ['./lecture-withdraw.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LectureWithdrawComponent extends BaseComponent implements OnInit {
  @ViewChild('dataTable') table: TableComponent;
  tableData: { data: ITableItem[]; pageIndex: number; pageSize: number; totalItem: number } = {
    data: [],
    pageIndex: 1,
    pageSize: PAGE_SIZE[0],
    totalItem: 0,
  };
  tableConfig: ITableConfig[] = TABLE_CONFIG.TABLE_LECTURE_WITHDRAW;
  isLoading = true;
  qrCode = '';
  last7Days = DATE_RANGE.LAST_7_DAYS;
  dialogRef: NzModalRef;
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userRepository: UserRepository,
    private bankRepository: BankRepository,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      from: DATE_RANGE.LAST_7_DAYS[0],
      to: DATE_RANGE.LAST_7_DAYS[1],
      plusMoney: false,
      minusMoney: false,
    });
  }

  ngOnInit(): void {
    this.formGroup.valueChanges.subscribe((val) => {
      this.onSearch();
    });
    // const data: IQrCodeBank = {
    //   accountNo: '0329311571',
    //   accountName: 'Ngân hàng TMCP Công thương Việt Nam',
    //   acqId: '970415',
    //   addInfo: 'Thanh toan',
    //   amount: 79000,
    //   template: 'compact',
    // };
    // this.subscribeOnce(this.bankRepository.generateQrCode(data), {
    //   onSuccess: (response) => {
    //     this.qrCode = response.qrCode;
    //   },
    // });
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

  getMoneyMustPay(money: number) {
    const moneyMustPay = money * 0.85 * -1;
    return moneyMustPay;
  }

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  getAllTransaction(params: BaseQueryRequest) {
    this.subscribeOnce(this.userRepository.getAllLectureWithdraw(params), {
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
    this.formGroup.patchValue({
      from: dateRange[0],
      to: dateRange[1],
    });
  }

  showModal(userId: string, amount: number, transId: string) {
    console.log('🚀 ~ LectureWithdrawComponent ~ showModal ~ userId:', userId);
    this.dialogRef = this.dialogService.open(QrcodeModalComponent, {
      title: this.translate.translate('Make payments'),
      footer: null,
      closable: true,
      width: '600px',
      data: {
        userId,
        amount: this.getMoneyMustPay(amount),
        moneyMinus: amount * -1,
        transId,
      },
    });

    this.dialogRef.afterClose.subscribe((isLoading) => {
      if (isLoading) {
        this.onSearch();
      }
    });
  }
}
