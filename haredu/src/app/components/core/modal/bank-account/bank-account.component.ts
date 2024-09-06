import { BaseComponent } from '#components/core/base/base.component';
import { BankRepository } from '#repositories/bank.repository';
import { UserRepository } from '#repositories/user.repository';
import { ComponentService } from '#services/component.service';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrl: './bank-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAccountComponent extends BaseComponent implements OnInit {
  readonly props = inject(NZ_MODAL_DATA);
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
    private bankRepository: BankRepository,
    private userRepository: UserRepository,
  ) {
    super(componentService);
  }

  banks: any[];

  private savedBankAccount: {
    bin: string;
    accountNumber: string;
    accountName: string;
    logo: string;
    shortName: string;
  };

  get data() {
    return this.props.data;
  }

  ngOnInit(): void {
    this.formGroup = this.data.isCreate
      ? this.formBuilder.group({
          bankName: ['', [Validators.required]],
          bankNumber: ['', [Validators.required]],
          fullName: ['', [Validators.required]],
        })
      : this.formBuilder.group({
          bankName: [this.data.bin, [Validators.required]],
          bankNumber: [this.data.accountNumber, [Validators.required]],
          fullName: [this.data.accountName, [Validators.required]],
        });
    this.formGroup.get('fullName')?.disable();
    this.subscribeOnce(this.bankRepository.getBanks(), {
      onSuccess: (data) => {
        this.banks = data;
        this.formGroup.patchValue({ bankName: this.data.isCreate ? data[0].bin : this.data.bin });
      },
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
  }

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  onButtonClickCheck() {
    this.subscribeOnce(
      this.bankRepository.lookup({
        bin: this.formGroup.value.bankName,
        accountNumber: this.formGroup.value.bankNumber,
      }),
      {
        onSuccess: (data) => {
          if (!!data?.accountName) {
            const bank = this.banks.find((item) => item.bin === this.formGroup.value.bankName);
            this.formGroup.patchValue({ fullName: data.accountName });
            this.savedBankAccount = {
              bin: this.formGroup.value.bankName,
              accountNumber: this.formGroup.value.bankNumber,
              accountName: data.accountName,
              logo: bank.logo,
              shortName: bank.shortName,
            };
          } else {
            this.formGroup.patchValue({ fullName: '' });
            this.toastService.error('Không tìm thấy account vui lòng thử lại');
          }
        },
      },
    );
  }

  onButtonClickCreate() {
    if (!!this?.savedBankAccount?.accountName) {
      this.subscribeOnce(this.userRepository.updateBank({ bank: this.savedBankAccount }), {
        onSuccess: () => this.modal.close(),
        onError: () => this.toastService.error('Vui lòn thử lại'),
      });
    } else {
      this.toastService.error('Vui lòng nhập account');
    }
  }
}
