import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureRegistrationComponent } from './lecture-registration.component';

describe('LectureRegistrationComponent', () => {
  let component: LectureRegistrationComponent;
  let fixture: ComponentFixture<LectureRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectureRegistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LectureRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
