import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { DemoComponent } from './demo/demo.component';
import { MainLayoutComponent } from '#components/layout/main-layout/main-layout.component';
import { Demo2Component } from './demo2/demo2.component';

const routes: Routes = [
  { path: 'error', component: ErrorComponent },
  {
    path: 'demo',
    component: MainLayoutComponent,
    children: [{ path: '', component: DemoComponent }],
  },
  {
    path: 'demo2',
    component: MainLayoutComponent,
    children: [{ path: '', component: Demo2Component }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommonsRoutingModule {}
