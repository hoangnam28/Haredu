import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, inject } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';
import { TableComponent } from '#components/core/table/table.component';
import { ITableConfig, ITableItem, SearchQuery } from '#interfaces/table.interface';
import { DATE_RANGE, INIT_TINY_EDITOR, PAGE_SIZE } from '#utils/const';
import { TABLE_CONFIG } from '#utils/table.config';
import { toSearchQuery } from '#utils/helpers';
import { UserRepository } from '#repositories/user.repository';
import { VideoRepository } from '#repositories/video.repository';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { environment } from 'src/environments/environment';
import { Observable, Observer } from 'rxjs';
import { Validators } from 'ngx-editor';

@Component({
  selector: 'app-video-update',
  templateUrl: './video-update.component.html',
  styleUrls: ['./video-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoUpdateComponent extends BaseComponent implements OnInit {
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userRepository: UserRepository,
    private videoRepository: VideoRepository,
    private modal: NzModalRef,
  ) {
    super(componentService);

    this.formGroup = this.formBuilder.group({
      name: [this.data.name, [Validators.required]],
      teachingFiledId: '',
      description: [this.data.description, [Validators.required]],
    });
  }

  // -----------------------------Variable global START------------------------------
  readonly props = inject(NZ_MODAL_DATA);
  get data() {
    return this.props.data;
  }
  apiUrl = environment.apiUrl;
  tinyKey = environment.TINY_MCE_API_KEY;
  init = INIT_TINY_EDITOR;
  fileds: any[];
  avatarUrl?: string;
  // -----------------------------Variable global END------------------------------

  ngOnInit(): void {
    this.getFields();
    this.avatarUrl = this.data.thumbnail;
  }

  private getFields() {
    this.subscribeOnce(this.userRepository.getFields({}), {
      onSuccess: (data: any[]) => {
        this.fileds = data;
        this.formGroup.patchValue({ teachingFiledId: this.data.categoryId });
      },
    });
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.toastService.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.toastService.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.avatarUrl = img;
          this.cdr.detectChanges();
        });
        this.toastService.success('Upload thumbnail success');
        break;
      case 'error':
        this.toastService.error('Network error');
        break;
    }
  }

  onClickCancel() {
    this.modal.close(false);
  }

  onClickSave() {
    this.subscribeOnce(this.videoRepository.update(this.data.id, this.formGroup.value), {
      onSuccess: (data) => {
        this.modal.close(true);
      },
    });
  }
}
