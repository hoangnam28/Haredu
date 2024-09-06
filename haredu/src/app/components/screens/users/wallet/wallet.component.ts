import { UserProfileService } from './../../../../services/user-profile.service';
import { BaseComponent } from '#components/core/base/base.component';
import { BankAccountComponent } from '#components/core/modal/bank-account/bank-account.component';
import { WithdrawMoneyComponent } from '#components/core/modal/withdraw-money/withdraw-money.component';
import { ComponentService } from '#services/component.service';
import { STRING, USER_ROLE } from '#utils/const';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { UserRepository } from '#repositories/user.repository';
import { environment } from 'src/environments/environment';
import { DepositMoneyComponent } from '../deposit-money/deposit-money.component';
import { jwtIsValid } from '#utils/jwt.helper';
import { PaymentRepository } from '#repositories/payment.repository';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletComponent extends BaseComponent implements OnInit {
  dialogRef: NzModalRef;
  userRole = USER_ROLE;
  currentRole: USER_ROLE;

  balance = signal(0);
  bank = signal({
    bin: '',
    accountName: '',
    accountNumber: '',
    logo: '',
    shortName: '',
  });
  serverUrl = environment.serverUrl;

  constructor(
    protected componentService: ComponentService,
    private userProfileService: UserProfileService,
    private userRepository: UserRepository,
    private paymentRepository: PaymentRepository,
  ) {
    super(componentService);
    this.currentRole = this.userProfileService.currentUser.role;
  }
  ngOnInit(): void {
    this.getBalance();
    this.getMe();
    this.validateToken();
  }

  getBalance() {
    this.subscribeOnce(this.userRepository.getBalance(), {
      onSuccess: (data: any) => {
        this.bank.set(data?.bank);
      },
    });
  }

  openBankModal() {
    this.dialogRef = this.dialogService.open(BankAccountComponent, {
      title: this.translate.translate('screens.users.addBank'),
      footer: null,
      closable: true,
      width: '600px',
      data: {
        isCreated: !this.bank(),
        bin: this.bank()?.bin ?? '',
        accountName: this.bank()?.accountName ?? '',
        accountNumber: this.bank()?.accountNumber ?? '',
      },
    });

    this.dialogRef.afterClose.subscribe(() => {
      this.subscribeOnce(this.userRepository.getBalance(), {
        onSuccess: (data: any) => {
          this.bank.set(data?.bank);
        },
      });
    });
  }

  getMe() {
    this.subscribeOnce(this.userRepository.getMe(), {
      onSuccess: (res) => {
        this.balance.set(Number(res.data.money ?? 0));
      },
    });
  }

  openWithdrawModal() {
    this.dialogRef = this.dialogService.open(WithdrawMoneyComponent, {
      title: 'Note: You will receive 85% of the withdrawn amount.',
      footer: null,
      closable: true,
      width: '600px',
      data: {
        isCreated: true,
        max: this.balance(),
      },
    });

    this.dialogRef.afterClose.subscribe((isLoading) => {
      isLoading && this.getMe();
    });
  }

  deposit() {
    this.dialogRef = this.dialogService.open(DepositMoneyComponent, {
      title: 'Deposit money into your account',
      footer: null,
      closable: true,
      width: '400px',
    });

    this.dialogRef.afterClose.subscribe(() => {});
  }

  private validateToken() {
    const failed = this.queryParams.get(STRING.FAILED);
    if (failed) {
      this.toastService.error('Deposit failed!!');
      return;
    }
    const token = this.queryParams.get(STRING.TOKEN);
    if (!token) return;

    const isValid = jwtIsValid(token);
    if (!isValid) {
      this.toastService.error('token.token-is-invalid-or-expired');
      return;
    }
    this.subscribeOnce(this.paymentRepository.confirm(token), {
      onSuccess: () => {
        this.getMe();
        this.toastService.success('Deposit successful!!');
      },
    });
  }
}
