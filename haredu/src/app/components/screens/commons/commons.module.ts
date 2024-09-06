import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonsRoutingModule } from './commons-routing.module';
import { ErrorComponent } from './error/error.component';
import { ShareModule } from '#components/share/share.module';
import { DemoComponent } from './demo/demo.component';
import { Demo2Component } from './demo2/demo2.component';
import { CreateDemoComponent } from '#components/core/modal/create-demo/create-demo.component';

@NgModule({
  declarations: [ErrorComponent, DemoComponent, Demo2Component, CreateDemoComponent],
  imports: [CommonModule, CommonsRoutingModule, ShareModule],
})
export class CommonsModule {}
