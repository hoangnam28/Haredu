import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureDetailComponent } from './lecture-detail.component';

describe('LectureDetailComponent', () => {
  let component: LectureDetailComponent;
  let fixture: ComponentFixture<LectureDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectureDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LectureDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
