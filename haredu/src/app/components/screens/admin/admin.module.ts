import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LectureWithdrawComponent } from './lecture-withdraw/lecture-withdraw.component';
import { ShareModule } from '#components/share/share.module';
import { QRCodeModule } from 'angularx-qrcode';
import { QrcodeModalComponent } from './qrcode-modal/qrcode-modal.component';

@NgModule({
  declarations: [LectureWithdrawComponent, QrcodeModalComponent],
  imports: [CommonModule, AdminRoutingModule, ShareModule, QRCodeModule],
})
export class AdminModule {}
