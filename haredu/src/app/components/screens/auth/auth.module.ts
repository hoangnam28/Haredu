import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth.routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ShareModule } from '#components/share/share.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RegisterComponent } from './registers/register/register.component';
import { RegisterEmailComponent } from './registers/register-email/register-email.component';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    RegisterComponent,
    RegisterEmailComponent,
  ],
  imports: [CommonModule, AuthRoutingModule, ShareModule],
  exports: [LoginComponent, ForgotPasswordComponent],
})
export class AuthModule {}
