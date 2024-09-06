import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';
import { IDesiredCourse } from '#interfaces/course.interface';

@Component({
  selector: 'app-desire-course-card',
  templateUrl: './desire-course-card.component.html',
  styleUrls: ['./desire-course-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesireCourseCardComponent extends BaseComponent implements OnInit {
  @Input() desiredCourse: IDesiredCourse;
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
}
