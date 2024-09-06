import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder, Validators } from '@angular/forms';
import { addDays, isBefore, isSameDay, startOfDay, startOfWeek } from 'date-fns';
import { ClassroomRepository } from '#repositories/classroom.repository';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { IClassroom, ICreateManySlot, ICreateSlot, ISlot, ISlotHasClass } from '#interfaces/class.interface';
import { CreateSlotComponent } from '#components/core/modal/create-slot/create-slot.component';
import { ActivatedRoute } from '@angular/router';
import { SLOTS, SOCKET_SCREEN_ACTION } from '#utils/const';
import { debounceTime, Subscription } from 'rxjs';
import { UserProfileService } from '#services/user-profile.service';

@Component({
  selector: 'app-set-up-slot',
  templateUrl: './set-up-slot.component.html',
  styleUrls: ['./set-up-slot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetUpSlotComponent extends BaseComponent implements OnInit {
  steps: string[] = ['1', '2'];
  currentStep = 0;
  currentWeek: Date[] = [];
  dialogRef: NzModalRef;
  currentSlot: ISlot;
  listSlot: ISlotHasClass[] = [];
  slots = SLOTS;
  class: IClassroom;
  localSlot: ICreateSlot[] = [];
  private confirmCreate: boolean = false;

  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private classroomRepository: ClassroomRepository,
    private activatedRoute: ActivatedRoute,
    private userProfileService: UserProfileService,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      numberSlot: ['', [Validators.required, Validators.min(1)]],
    });
  }

  get classroomId() {
    return this.activatedRoute.snapshot.params.id;
  }

  get weekCalculate() {
    return Math.ceil(this.formGroup.value.numberSlot / 3);
  }

  ngOnInit(): void {
    // this.getSlots({});
    this.subscribeOnce(this.classroomRepository.getClassById(this.classroomId), {
      onSuccess: (response) => {
        this.loadWeek(new Date(response.data.endTime));
        this.class = response.data;
        this.cdr.detectChanges();
      },
    });
    this.subscribeUntilDestroy(this.getControl('numberSlot')!.valueChanges.pipe(debounceTime(500)), () => {
      this.getSlots();
    });
  }

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  onNextStep() {
    if (this.currentStep === 0 && this.getControl('numberSlot')?.invalid) {
      this.componentService.toast.warning('toast.numberSlot');
      return;
    }
    if (this.currentStep < this.steps.length - 1) this.currentStep++;
  }

  onBackStep() {
    if (this.currentStep > 0) this.currentStep--;
  }

  onSubmit() {}

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
    const slotsToday = this.localSlot.filter((s) => isSameDay(s?.startTime, startDate));
    console.log('🚀 ~ SetUpSlotComponent ~ addSlot ~ slotsToday:', slotsToday);

    if (slotsToday.length >= 2) {
      this.componentService.toast.warning('You should not leave more than 2 slots per day.');
    }

    if (this.localSlot.length >= this.formGroup.value.numberSlot) {
      this.componentService.toast.warning('You should not leave more than the number of slots you have chosen.');
      return;
    }
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

    this.dialogRef.afterClose.subscribe((data) => {
      this.localSlot.push(data);
      this.listSlot.push({ ...data, classroomId: this.class });
      this.cdr.detectChanges();
    });
  }

  openEditModal(slot: ISlotHasClass, index: number) {
    this.dialogRef = this.dialogService.open(CreateSlotComponent, {
      title: this.translate.translate('Create slot'),
      footer: null,
      closable: true,
      width: '600px',
      data: {
        ...slot,
      },
    });

    this.dialogRef.afterClose.subscribe((data) => {
      this.localSlot[index] = data;
      this.listSlot[index] = { ...data, classroomId: this.class };
      this.cdr.detectChanges();
    });
  }

  isDisabled(day: Date): boolean {
    return isBefore(day, startOfDay(this.class.endTime));
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

  getSlots() {
    this.subscribeOnce(
      this.classroomRepository.getAllSlots({
        timeStart: new Date(this.class.endTime),
        timeEnd: addDays(this.currentWeek[6], this.weekCalculate),
      }),
      {
        onSuccess: (response) => {
          this.listSlot = response.data;
          this.localSlot = [];
          this.cdr.detectChanges();
        },
      },
    );
  }

  remove(day: Date, slot: { startTime: string; endTime: string }) {
    const [startHour, startMinute] = slot.startTime.split(':').map(Number);
    const [endHour, endMinute] = slot.endTime.split(':').map(Number);

    const index = this.listSlot.findIndex((currentSlot) => {
      const slotStart = new Date(currentSlot.startTime);
      const slotEnd = new Date(currentSlot.endTime);

      return (
        isSameDay(day, slotStart) &&
        slotStart.getHours() === startHour &&
        slotStart.getMinutes() === startMinute &&
        slotEnd.getHours() === endHour &&
        slotEnd.getMinutes() === endMinute
      );
    });

    const index2 = this.localSlot.findIndex((currentSlot) => {
      const slotStart = new Date(currentSlot.startTime);
      const slotEnd = new Date(currentSlot.endTime);

      return (
        isSameDay(day, slotStart) &&
        slotStart.getHours() === startHour &&
        slotStart.getMinutes() === startMinute &&
        slotEnd.getHours() === endHour &&
        slotEnd.getMinutes() === endMinute
      );
    });

    if (index !== -1) {
      this.listSlot.splice(index, 1);
    }
    if (index2 !== -1) {
      this.localSlot.splice(index2, 1);
    }
    this.cdr.detectChanges();
  }

  saveChange() {
    const data: ICreateManySlot = {
      slots: this.localSlot,
      classroomId: this.classroomId,
    };
    this.subscribeOnce(this.classroomRepository.createManySlot(data), {
      onSuccess: () => {
        this.componentService.toast.success('Create slot success');
        this.confirmCreate = true;
        this.socket.sendMessage(SOCKET_SCREEN_ACTION.SEND_NOTIFY, {
          title: ' created a class named ' + this.class.name,
          owner: this.userProfileService.currentUser._id,
          link: `/classroom/${this.classroomId}`,
        });
        this.redirect(`/classroom/${this.classroomId}`);
      },
    });
  }

  protected override preDestroy(): void {
    if (this.confirmCreate) return;
    this.subscribeOnce(this.classroomRepository.deleteClass(this.classroomId), {
      onSuccess: () => {
        this.componentService.toast.success('Delete class success');
      },
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  handleClose(event: BeforeUnloadEvent) {
    if (this.confirmCreate) return;
    event.preventDefault();
    event.returnValue = '';
  }
}
