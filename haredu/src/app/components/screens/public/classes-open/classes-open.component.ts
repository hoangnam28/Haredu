import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';
import { IFiled } from '#interfaces/account.interface';
import { UserRepository } from '#repositories/user.repository';
import { IClassroom } from '#interfaces/class.interface';
import { ClassroomRepository } from '#repositories/classroom.repository';
import { BaseQueryRequest } from '#interfaces/api.interface';
import { debounceTime } from 'rxjs';
import { DATE_RANGE } from '#utils/const';

@Component({
  selector: 'app-classes-open',
  templateUrl: './classes-open.component.html',
  styleUrls: ['./classes-open.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassesOpenComponent extends BaseComponent implements OnInit {
  fileds: IFiled[] = [];
  classes: IClassroom[] = [];
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userRepository: UserRepository,
    private classroomRepository: ClassroomRepository,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      fileds: [[], []],
      search: ['', []],
    });
  }

  ngOnInit(): void {
    this.subscribeUntilDestroy(this.getControl('search')!.valueChanges.pipe(debounceTime(500)), (res) => {
      this.getClassrooms({ text: res as string, from: new Date() });
    });
    this.subscribeUntilDestroy(this.getControl('fileds')!.valueChanges.pipe(debounceTime(500)), (res) => {
      this.getClassrooms({ text: this.formGroup.value.search, teachFileds: res, from: new Date() });
    });
    this.getClassrooms({ from: new Date() });
    this.getFields();
  }

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  getFields() {
    this.subscribeOnce(this.userRepository.getFields({}), {
      onSuccess: (response) => {
        this.fileds = response;
        this.cdr.detectChanges();
      },
    });
  }

  getClassrooms(params: BaseQueryRequest) {
    this.subscribeOnce(this.classroomRepository.getAllClasses(params), {
      onSuccess: (response) => {
        this.classes = response.records;
        this.cdr.detectChanges();
      },
    });
  }
}
