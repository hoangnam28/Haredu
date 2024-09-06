import { ProfileLayoutComponent } from '#components/layout/profile-layout/profile-layout.component';
import { LoginGuard } from '#guards/login.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '#guards/auth.guard';
import { MainLayoutComponent } from '#components/layout/main-layout/main-layout.component';
import { NormalLayoutComponent } from '#components/layout/normal-layout/normal-layout.component';
import { USER_ROLE } from '#utils/const';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [LoginGuard],
    loadChildren: () => import('#components/screens/auth/auth.module').then((m) => m.AuthModule),
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: '',
    component: NormalLayoutComponent,
    loadChildren: () => import('#components/screens/public/public.module').then((m) => m.PublicModule),
  },
  {
    path: 'commons',
    loadChildren: () => import('#components/screens/commons/commons.module').then((m) => m.CommonsModule),
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    component: ProfileLayoutComponent,
    loadChildren: () => import('#components/screens/users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'lecture',
    canActivate: [AuthGuard],
    data: { expectedRole: [USER_ROLE.TUTOR] },
    component: NormalLayoutComponent,
    loadChildren: () => import('#components/screens/lecture/lecture.module').then((m) => m.LectureModule),
  },
  {
    path: 'student',
    canActivate: [AuthGuard],
    data: { expectedRole: [USER_ROLE.STUDENT] },
    component: NormalLayoutComponent,
    loadChildren: () => import('#components/screens/student/student.module').then((m) => m.StudentModule),
  },
  {
    path: 'staff',
    canActivate: [AuthGuard],
    data: { expectedRole: [USER_ROLE.STAFF] },
    component: MainLayoutComponent,
    loadChildren: () => import('#components/screens/staff/staff.module').then((m) => m.StaffModule),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { expectedRole: [USER_ROLE.ADMIN] },
    component: MainLayoutComponent,
    loadChildren: () => import('#components/screens/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: '**',
    redirectTo: '/commons/error',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
