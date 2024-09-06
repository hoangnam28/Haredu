import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';
import { addDays, isBefore, isSameDay, setHours, setMinutes, startOfDay, startOfWeek } from 'date-fns';
import { SLOTS } from '#utils/const';
import { CreateSlotComponent } from '#components/core/modal/create-slot/create-slot.component';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ISlot } from '#interfaces/class.interface';
import { ClassroomRepository } from '#repositories/classroom.repository';
import { BaseQueryRequest } from '#interfaces/api.interface';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulesComponent extends BaseComponent implements OnInit {
  currentWeek: Date[] = [];
  slots = SLOTS;
  dialogRef: NzModalRef;
  @Input() classroomId: string;
  currentSlot: ISlot;
  listSlot: ISlot[] = [];
  isShowSlotDetail = false;
  slotId: string = '';
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private classroomRepository: ClassroomRepository,
  ) {
    super(componentService);
  }

  ngOnInit(): void {
    this.loadWeek(new Date());
    this.getSlots({});
  }

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  loadWeek(date: Date): void {
    this.currentWeek = this.getWeekDates(date);
  }

  getWeekDates(date: Date): Date[] {
    const startDate = startOfWeek(date, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }, (x, i) => addDays(startDate, i));
    return days;
  }

  nextWeek(): void {
    const nextWeekStart = addDays(this.currentWeek[6], 1);
    this.loadWeek(nextWeekStart);
  }

  previousWeek(): void {
    const previousWeekStart = addDays(this.currentWeek[0], -7);
    this.loadWeek(previousWeekStart);
  }

  addSlot(day: Date, slot: { startTime: string; endTime: string }): void {
    const [startHour, startMinute] = slot.startTime.split(':').map(Number);
    const [endHour, endMinute] = slot.endTime.split(':').map(Number);
    const dayStart = startOfDay(day);
    const startDate = new Date(dayStart);
    startDate.setHours(startHour, startMinute);
    const endDate = new Date(dayStart);
    endDate.setHours(endHour, endMinute);
    this.showModalAddSlot(startDate, endDate);
  }

  showModalAddSlot(startTime: Date, endTime: Date) {
    this.dialogRef = this.dialogService.open(CreateSlotComponent, {
      title: this.translate.translate('Create slot'),
      footer: null,
      closable: true,
      width: '600px',
      data: {
        isCreated: true,
        classroomId: this.classroomId,
        startTime,
        endTime,
      },
    });

    this.dialogRef.afterClose.subscribe((isLoading) => {
      isLoading && this.getSlots({});
    });
  }

  isDisabled(day: Date): boolean {
    return isBefore(day, startOfDay(new Date()));
  }

  getSlotForDay(day: Date, slot: { startTime: string; endTime: string }): ISlot | null {
    if (this.listSlot.length === 0) return null;
    const [startHour, startMinute] = slot.startTime.split(':').map(Number);
    const [endHour, endMinute] = slot.endTime.split(':').map(Number);

    for (const currentSlot of this.listSlot) {
      const slotStart = new Date(currentSlot.startTime);
      const slotEnd = new Date(currentSlot.endTime);

      if (
        isSameDay(day, slotStart) &&
        slotStart.getHours() === startHour &&
        slotStart.getMinutes() === startMinute &&
        slotEnd.getHours() === endHour &&
        slotEnd.getMinutes() === endMinute
      ) {
        return currentSlot;
      }
    }

    return null;
  }

  getSlots(params: BaseQueryRequest) {
    this.subscribeOnce(this.classroomRepository.getSlots(this.classroomId, params), {
      onSuccess: (res) => {
        this.listSlot = res.data.records;
        this.cdr.detectChanges();
      },
    });
  }

  viewSlotDetail(slotId: string) {
    // this.redirect(`classroom/slot/meeting/${slotId}`);
    this.slotId = slotId;
    this.isShowSlotDetail = true;
    this.cdr.detectChanges();
  }

  handleClose(event: boolean) {
    if (event) {
      this.isShowSlotDetail = false;
      this.cdr.detectChanges();
    }
  }
}
