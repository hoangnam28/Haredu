import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureUpdateDetailComponent } from './lecture-update-detail.component';

describe('LectureUpdateDetailComponent', () => {
  let component: LectureUpdateDetailComponent;
  let fixture: ComponentFixture<LectureUpdateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectureUpdateDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LectureUpdateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
