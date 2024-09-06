import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder, Validators } from '@angular/forms';
import { PaymentRepository } from '#repositories/payment.repository';

@Component({
  selector: 'app-deposit-money',
  templateUrl: './deposit-money.component.html',
  styleUrls: ['./deposit-money.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositMoneyComponent extends BaseComponent implements OnInit {
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private paymentRepository: PaymentRepository,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      amount: [10000, [Validators.required, Validators.min(10000)]],
    });
  }

  ngOnInit(): void {}

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  onSubmit() {
    this.ngSubmit({
      observable: this.paymentRepository.createPayment(this.formGroup.value.amount),
      onSuccess: (data) => {
        window.open(data.data.paymentLink);
      },
    });
  }
}
