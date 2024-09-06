import { BaseComponent } from '#components/core/base/base.component';
import { ICreateSlot } from '#interfaces/class.interface';
import { ClassroomRepository } from '#repositories/classroom.repository';
import { ComponentService } from '#services/component.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-create-slot',
  templateUrl: './create-slot.component.html',
  styleUrl: './create-slot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateSlotComponent extends BaseComponent implements OnInit {
  readonly props = inject(NZ_MODAL_DATA);
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private classroomRepository: ClassroomRepository,
    private modal: NzModalRef,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      date: [[], []],
    });
  }

  get classRoomId() {
    return this.props.data.classroomId;
  }

  get startTime(): Date {
    return this.props.data.startTime;
  }

  get endTime(): Date {
    return this.props.data.endTime;
  }

  get description() {
    return this.props.data.description ?? '';
  }

  get title() {
    return this.props.data.title ?? '';
  }

  ngOnInit(): void {
    this.formGroup.patchValue({
      startTime: this.startTime,
      endTime: this.endTime,
      title: this.title,
      description: this.description,
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const data: ICreateSlot = {
      ...this.formGroup.value,
      classroomId: this.classRoomId,
    };
    this.modal.close(data);
    // this.ngSubmit({
    //   observable: this.classroomRepository.createSlot(data),
    //   onSuccess: () => {
    //     this.componentService.toast.success('Tạo slot thành công');
    //     this.modal.close(true);
    //   },
    // });
  }

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }
}
