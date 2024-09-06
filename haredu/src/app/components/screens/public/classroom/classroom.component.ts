import { UserProfileService } from './../../../../services/user-profile.service';
import { ActivatedRoute } from '@angular/router';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';
import { ClassroomRepository } from '#repositories/classroom.repository';
import { IClassroom } from '#interfaces/class.interface';
import { environment } from 'src/environments/environment';
import { PAGE_SIZE, USER_ROLE } from '#utils/const';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { TableComponent } from '#components/core/table/table.component';
import { ITableConfig, ITableItem, SearchQuery } from '#interfaces/table.interface';
import { toSearchQuery } from '#utils/helpers';
import { TABLE_CONFIG } from '#utils/table.config';
import { endOfDay } from 'date-fns';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassroomComponent extends BaseComponent implements OnInit, AfterViewInit {
  class: IClassroom | undefined;
  serverUrl = environment.serverUrl;
  role = USER_ROLE;
  dialogRef: NzModalRef;
  @ViewChild('description', { static: false }) descriptionElement: ElementRef;
  @ViewChild('dataTable') table: TableComponent;
  tableData: { data: ITableItem[]; pageIndex: number; pageSize: number; totalItem: number } = {
    data: [],
    pageIndex: 1,
    pageSize: PAGE_SIZE[0],
    totalItem: 0,
  };
  tableConfig: ITableConfig[] = TABLE_CONFIG.TABLE_CLASS_PEOPLE;
  isLoading = true;
  isInClass = false;
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private activetedRoute: ActivatedRoute,
    private classroomRepository: ClassroomRepository,
    private userProfileService: UserProfileService,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      search: ['', []],
    });
  }

  get userRole() {
    return this.userProfileService.currentUser.role;
  }

  get classroomId() {
    return this.activetedRoute.snapshot.params.id;
  }
  ngOnInit(): void {
    this.isInClass =
      this.class?.students.some((student) => student._id === this.userProfileService.currentUser._id) || false;
  }

  ngAfterViewInit(): void {
    this.getClassDetail();
  }

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  getClassDetail() {
    this.subscribeOnce(this.classroomRepository.getClassById(this.classroomId), {
      onSuccess: (response) => {
        this.class = response.data;
        this.tableData = {
          data: response.data.students,
          pageIndex: 1,
          pageSize: 25,
          totalItem: response.data.students.length,
        };
        this.isLoading = false;
        this.tableData.data = response.data.students || [];
        this.isInClass =
          this.class?.students.some((student) => student._id === this.userProfileService.currentUser._id) || false;
        const shadowHost = this.descriptionElement.nativeElement;
        const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = this.class?.description;
        this.cdr.detectChanges();
      },
    });
  }

  async onSearch(data: Partial<SearchQuery> = { pageIndex: 1 }) {
    const { pageIndex, pageSize, sort } = { ...this.tableData, ...this.table.queries, ...data };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const query = toSearchQuery({ pageIndex, pageSize, sort }, { text: this.formGroup.value.search });
  }

  joinClass() {
    this.subscribeOnce(this.classroomRepository.joinClass(this.classroomId), {
      onSuccess: () => {
        this.getClassDetail();
        if (!this.isInClass) {
          this.componentService.toast.success('You have been join class!');
        } else {
          this.componentService.toast.success('You have been leave class!');
        }
        this.cdr.detectChanges();
      },
    });
  }

  withdraw() {
    if (!this.class) return;
    if (endOfDay(new Date(this.class.endTime)) > endOfDay(new Date())) {
      this.componentService.toast.warning(
        'You can only receive money from the class after the registration period ends!',
      );
      return;
    }

    this.subscribeOnce(this.classroomRepository.withDrawMoneyFromClass(this.classroomId), {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSuccess: (res: any) => {
        this.componentService.toast.success(
          `You have successfully withdrawn ${res.data.money} (VND) from the class to your account!!`,
        );
        this.cdr.detectChanges();
      },
    });
  }
}
