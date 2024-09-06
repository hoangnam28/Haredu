import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';
import { IClassroom } from '#interfaces/class.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-class-card',
  templateUrl: './class-card.component.html',
  styleUrls: ['./class-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassCardComponent extends BaseComponent implements OnInit {
  @Input() desiredCourse: IClassroom;
  serverUrl = environment.serverUrl;
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    super(componentService);
  }

  ngOnInit(): void {}

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  redirectToClassroom(id: string) {
    this.redirect(`/classroom/${id}`);
  }
}
