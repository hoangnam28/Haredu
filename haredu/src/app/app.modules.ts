import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoRootModule } from '#core/translate.module';
import { ShareModule } from '#components/share/share.module';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { SocketIoModule } from 'ngx-socket-io';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtInterceptor } from '#core/jwt.interceptor';
import { ErrorInterceptor } from '#core/error.interceptor';
import { HttpErrorHandler } from '#services/http-error-handler.service';
import { DialogComponent } from '#components/core/dialog/dialog.component';
import { AppHttpClient } from '#services/app-http-client.service';
import { AuthService } from '#services/auth.service';
import { BaseComponent } from '#components/core/base/base.component';
import { ToastComponent } from '#components/core/toast/toast.component';
import { MainLayoutComponent } from '#components/layout/main-layout/main-layout.component';
import { UserRepository } from '#repositories/user.repository';
import { AuthRepository } from '#repositories/auth.repository';
import { DemoRepository } from '#repositories/demo.repository';
import { BankRepository } from '#repositories/bank.repository';
import { ProfileLayoutComponent } from '#components/layout/profile-layout/profile-layout.component';
import { HeaderComponent } from '#components/layout/header/header.component';
import { NormalLayoutComponent } from '#components/layout/normal-layout/normal-layout.component';
import { ClassroomRepository } from '#repositories/classroom.repository';
import { VideoRepository } from '#repositories/video.repository';
import { PaymentRepository } from '#repositories/payment.repository';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    MainLayoutComponent,
    ProfileLayoutComponent,
    HeaderComponent,
    NormalLayoutComponent,
  ],
  imports: [
    ShareModule,
    BrowserModule,
    MatIconModule,
    SocketIoModule,
    TranslocoModule,
    AppRoutingModule,
    HttpClientModule,
    TranslocoRootModule,
    BrowserAnimationsModule,
    QRCodeModule,
  ],
  providers: [
    HttpErrorHandler,
    DialogComponent,
    ToastComponent,
    AppHttpClient,
    AuthService,
    UserRepository,
    AuthRepository,
    DemoRepository,
    ClassroomRepository,
    BankRepository,
    VideoRepository,
    PaymentRepository,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
