import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-lecture-detail',
  templateUrl: './lecture-detail.component.html',
  styleUrl: './lecture-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LectureDetailComponent {}
