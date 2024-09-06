import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';
import { BaseQueryRequest } from '#interfaces/api.interface';
import { addDays, isBefore, isSameDay, startOfDay, startOfWeek } from 'date-fns';
import { ClassroomRepository } from '#repositories/classroom.repository';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SLOTS } from '#utils/const';
import { ISlot, ISlotHasClass } from '#interfaces/class.interface';

@Component({
  selector: 'app-my-schedule',
  templateUrl: './my-schedule.component.html',
  styleUrls: ['./my-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyScheduleComponent extends BaseComponent implements OnInit {
  currentWeek: Date[] = [];
  slots = SLOTS;
  dialogRef: NzModalRef;
  @Input() classroomId: string;
  currentSlot: ISlot;
  listSlot: ISlotHasClass[] = [];
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
    this.getSlots(new Date(this.currentWeek[0]), new Date(this.currentWeek[6]));
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
    this.getSlots(new Date(this.currentWeek[0]), new Date(this.currentWeek[6]));
  }

  previousWeek(): void {
    const previousWeekStart = addDays(this.currentWeek[0], -7);
    this.loadWeek(previousWeekStart);
    this.getSlots(new Date(this.currentWeek[0]), new Date(this.currentWeek[6]));
  }

  isDisabled(day: Date): boolean {
    return isBefore(day, startOfDay(new Date()));
  }

  getSlotForDay(day: Date, slot: { startTime: string; endTime: string }): ISlotHasClass | null {
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

  viewSlotDetail(slotId: string) {
    // this.redirect(`classroom/slot/meeting/${slotId}`);
    this.slotId = slotId;
    this.isShowSlotDetail = true;
    this.cdr.detectChanges();
  }

  getSlots(timeStart: Date, timeEnd: Date) {
    this.subscribeOnce(
      this.classroomRepository.getAllMySlots({
        timeStart: timeStart,
        timeEnd: timeEnd,
      }),
      {
        onSuccess: (response) => {
          this.listSlot = response.data;
          this.cdr.detectChanges();
        },
      },
    );
  }

  redirectToClassDetail(classId: string) {
    this.redirect(`classroom/${classId}`);
  }
}
