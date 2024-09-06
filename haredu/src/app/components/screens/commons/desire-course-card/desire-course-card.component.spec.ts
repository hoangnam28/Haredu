import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesireCourseCardComponent } from './desire-course-card.component';

describe('DesireCourseCardComponent', () => {
  let component: DesireCourseCardComponent;
  let fixture: ComponentFixture<DesireCourseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesireCourseCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesireCourseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
