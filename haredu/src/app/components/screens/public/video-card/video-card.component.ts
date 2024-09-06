import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';
import { IVideo } from '#interfaces/video.interface';
import { USER_ROLE } from '#utils/const';
import { MappingNameRoleByRoles } from 'src/app/config/sidebar.config';

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCardComponent extends BaseComponent implements OnInit {
  @Input() video: IVideo;
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

  getRoleName(role: USER_ROLE): string {
    return MappingNameRoleByRoles[role];
  }
}
