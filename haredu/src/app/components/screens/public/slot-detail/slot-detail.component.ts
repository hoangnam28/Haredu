import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';
import { ICreateRoom, ISlot } from '#interfaces/class.interface';
import { ClassroomRepository } from '#repositories/classroom.repository';
import { UserProfileService } from '#services/user-profile.service';
import { USER_ROLE } from '#utils/const';
import { IRoom } from '#interfaces/meeting.interface';

@Component({
  selector: 'app-slot-detail',
  templateUrl: './slot-detail.component.html',
  styleUrls: ['./slot-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlotDetailComponent extends BaseComponent implements OnInit {
  @Input() slotId: string;
  @Output() close = new EventEmitter<boolean>();
  currentSlot: ISlot | undefined;
  role = USER_ROLE;
  room: IRoom;
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private classroomRepository: ClassroomRepository,
    private userProfileService: UserProfileService,
  ) {
    super(componentService);
  }

  get isHidenBtnJoinStream() {
    if (!this.currentSlot) return true;
    if (this.currentSlot.startTime > new Date() || this.currentSlot.endTime < new Date()) return false;
    return true;
  }

  ngOnInit(): void {
    this.getSlotById(this.slotId);
    this.subscribeOnce(this.classroomRepository.getRoomById(this.slotId), {
      onSuccess: (res) => {
        console.log('🚀 ~ SlotDetailComponent ~ this.subscribeOnce ~ res:', res);
        this.room = res.data;
        this.cdr.detectChanges();
      },
    });
  }

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  getSlotById(slotId: string) {
    this.subscribeOnce(this.classroomRepository.getSlotById(slotId), {
      onSuccess: (res) => {
        this.currentSlot = res.data;
        this.cdr.detectChanges();
      },
    });
  }

  backPage() {
    this.close.emit(true);
    this.leaveStream();
  }

  joinStream() {
    if (!this.room) {
      this.componentService.toast.warning('Room not found, please try again later.');
      return;
    }
    this.redirect(`classroom/slot/meeting/${this.slotId}`);
  }

  createStream() {
    if (this.room) {
      this.joinStream();
      return;
    }
    const data: ICreateRoom = {
      slotId: this.slotId,
    };
    this.subscribeOnce(this.classroomRepository.createRoom(data), {
      onSuccess: () => {
        this.redirect(`classroom/slot/meeting/${this.slotId}`);
      },
    });
  }

  leaveStream() {
    // this.agoraService.leaveAndRemoveLocalStream();
  }

  micOn() {
    // this.agoraService.toggleMic(true);
  }

  handleCamera() {
    // this.agoraService.toggleCamera(false);
  }

  get userRole() {
    return this.userProfileService.currentUser.role;
  }
}
