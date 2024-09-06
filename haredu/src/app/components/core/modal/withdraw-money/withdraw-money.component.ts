import { BaseComponent } from '#components/core/base/base.component';
import { UserRepository } from '#repositories/user.repository';
import { ComponentService } from '#services/component.service';
import { VALID_LENGTH } from '#utils/const';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { PasswordValidator } from 'src/app/validators/password.validator';

@Component({
  selector: 'app-withdraw-money',
  templateUrl: './withdraw-money.component.html',
  styleUrl: './withdraw-money.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawMoneyComponent extends BaseComponent implements OnInit {
  readonly props = inject(NZ_MODAL_DATA);
  passwordVisible = false;
  PASSWORD_MAX_LENGTH = VALID_LENGTH.MAX_LENGTH;
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
    private userRepository: UserRepository,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      money: ['', [Validators.required]],
      password: ['', [Validators.required, PasswordValidator]],
    });
  }

  get data() {
    return this.props.data;
  }

  get maxMoney() {
    return this.data?.max;
  }

  ngOnInit(): void {}

  onSubmit(event: Event) {
    event.preventDefault();
    this.ngSubmit({
      observable: this.userRepository.withDrawMoney({
        money: parseFloat(this.formGroup.value.money),
        password: this.formGroup.value.password,
      }),
      onSuccess: (res: any) => {
        this.componentService.toast.success(
          `You have successfully withdrawn ${res.data.money} (VND) from the class to your account! Please wait for admin to confirm the transfer!`,
        );
        this.modal.close(true);
      },
    });
  }

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }
}
