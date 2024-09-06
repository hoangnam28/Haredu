import { UserRepository } from '#repositories/user.repository';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { BankRepository } from '#repositories/bank.repository';
import { IQrCodeBank } from '#interfaces/transaction.interface';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-qrcode-modal',
  templateUrl: './qrcode-modal.component.html',
  styleUrls: ['./qrcode-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrcodeModalComponent extends BaseComponent implements OnInit {
  readonly props = inject(NZ_MODAL_DATA);
  qrCode = '';
  img = '';
  isReject = false;
  apiUrl = environment.apiUrl;
  serverUrl = environment.serverUrl;
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userRepository: UserRepository,
    private bankRepository: BankRepository,

    private modal: NzModalRef,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      reasonReject: ['', [Validators.required]],
      proof: ['', [Validators.required]],
    });
  }

  get data() {
    return this.props.data;
  }

  get userId() {
    return this.data.userId;
  }

  get transId() {
    return this.data.transId;
  }

  get amount() {
    return this.data.amount;
  }

  get moneyMinus() {
    return this.data.moneyMinus;
  }

  ngOnInit(): void {
    this.subscribeOnce(this.userRepository.getTutor(this.userId), {
      onSuccess: (res) => {
        const data: IQrCodeBank = {
          accountNo: res.data.bank.accountNumber,
          accountName: res.data.bank.shortName,
          acqId: res.data.bank.bin,
          addInfo: 'Rut tien khoi he thong',
          amount: this.amount,
          template: 'compact2',
        };
        this.subscribeOnce(this.bankRepository.generateQrCode(data), {
          onSuccess: (response) => {
            this.qrCode = response.qrCode;
            this.img = response.qrDataURL;
            this.cdr.detectChanges();
          },
        });
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

  showReject() {
    if (this.isReject === true) {
      const control = this.getControl('reasonReject');
      if (control?.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
        return;
      }
      this.subscribeOnce(this.userRepository.rejectTrans(this.transId, this.formGroup.value.reasonReject), {
        onSuccess: (res) => {
          this.componentService.toast.success('Reject success full');
          this.modal.close(true);
        },
      });
    }
    this.isReject = true;
    this.ngSubmit;
  }

  showAccept() {
    if (this.isReject === false) {
      const control = this.getControl('proof');
      if (control?.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
        return;
      }
      this.subscribeOnce(
        this.userRepository.confirmTrans(this.userId, this.transId, this.formGroup.value.proof, this.moneyMinus),
        {
          onSuccess: (res) => {
            this.componentService.toast.success('Accept success full');
            this.modal.close(true);
          },
        },
      );
    }
    this.isReject = false;
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isImage = file.type ? file.type.startsWith('image/') : false;
      if (!isImage) {
        this.componentService.toast.error('toast.onlyImage');
        observer.complete();
        return;
      }
      const isLt20M = file.size! / 1024 / 1024 < 20;
      if (!isLt20M) {
        this.componentService.toast.error('toast.imageSize');
        observer.complete();
        return;
      }
      observer.next(isImage && isLt20M);
      observer.complete();
    });

  handleChange(info: { file: NzUploadFile }, controlName: string): void {
    switch (info.file.status) {
      case 'done': {
        this.componentService.toast.success('toast.uploadImageSuccess');
        this.formGroup.controls[controlName].setValue(info.file.response.data[0].imageUrl);
        break;
      }
      case 'error':
        this.componentService.toast.error('toast.uploadImageFail');
        break;
    }
  }
}
