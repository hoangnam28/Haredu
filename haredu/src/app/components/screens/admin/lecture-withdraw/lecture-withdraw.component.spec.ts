import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureWithdrawComponent } from './lecture-withdraw.component';

describe('LectureWithdrawComponent', () => {
  let component: LectureWithdrawComponent;
  let fixture: ComponentFixture<LectureWithdrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectureWithdrawComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LectureWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
