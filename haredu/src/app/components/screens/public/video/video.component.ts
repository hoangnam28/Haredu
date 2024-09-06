import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';
import { IFiled } from '#interfaces/account.interface';
import { UserRepository } from '#repositories/user.repository';
import { IVideo } from '#interfaces/video.interface';
import { USER_ROLE } from '#utils/const';
import { VideoRepository } from '#repositories/video.repository';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoComponent extends BaseComponent implements OnInit {
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userRepository: UserRepository,
    private videoRepository: VideoRepository,
    private route: ActivatedRoute,
  ) {
    super(componentService);
  }

  //=================================VARIABLE=========================================

  serverUrl = environment.serverUrl;

  listVideo: any[] = [];
  listCategory: string[];

  inputValue: string = '';
  private allOptionsSearch: string[] = [];
  renderOptionsSearch: string[] = [];
  private LSB = 'hareduSearchBuffer';
  selectedCategoty: string = '';

  get listVideoRender() {
    return this.listVideo.filter((item) => {
      if (!this.selectedCategoty?.trim()) return true;
      return item.teachingFiledId.name === this.selectedCategoty;
    });
  }
  //=================================VARIABLE=========================================

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.inputValue = params['search'] ?? '';
      this.getAll({ search: this.inputValue });
    });
    this.getAllCategory();

    const bufferString = localStorage.getItem(this.LSB);
    if (bufferString !== null) {
      this.setAllOptionsSearch(JSON.parse(bufferString));
    } else {
      localStorage.setItem(this.LSB, [].toString());
    }
  }

  private getAll(filter: any) {
    this.subscribeOnce(this.videoRepository.getAll(filter), {
      onSuccess: (data) => {
        this.listVideo = data;
        this.cdr.detectChanges();
      },
      onComplete: () => {
        this.cdr.detectChanges();
      },
    });
  }

  private getAllCategory() {
    this.subscribeOnce(this.videoRepository.getAllCategory(), {
      onSuccess: (data: any[]) => {
        this.setAllOptionsSearch(data.map((item) => item.name));
        this.renderOptionsSearch = this.allOptionsSearch;
        this.listCategory = data.map((item) => item.name);
      },
      onComplete: () => {
        this.cdr.detectChanges();
      },
    });
  }

  onChange(value: string): void {
    this.renderOptionsSearch = this.allOptionsSearch.filter((item) => item.toLowerCase().includes(value.toLowerCase()));
    this.renderOptionsSearch.push(value);
    this.cdr.detectChanges();
  }

  compareFun = (o1: string, o2: string): boolean => {
    if (o1) {
      return o1 === o2;
    } else {
      return false;
    }
  };

  private setAllOptionsSearch(data: string[]) {
    this.allOptionsSearch.push(...data);
    this.allOptionsSearch = [...new Set(this.allOptionsSearch)];
    localStorage.setItem(this.LSB, JSON.stringify(this.allOptionsSearch));
  }

  onSearch() {
    if (this.inputValue.trim()) {
      this.setAllOptionsSearch([this.inputValue]);
      this.router.navigate(['/videos'], { queryParams: { search: this.inputValue } });
    }
  }

  onChangeSelect() {}
}
