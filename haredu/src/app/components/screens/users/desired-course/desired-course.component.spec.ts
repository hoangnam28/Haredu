import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesiredCourseComponent } from './desired-course.component';

describe('DesiredCourseComponent', () => {
  let component: DesiredCourseComponent;
  let fixture: ComponentFixture<DesiredCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesiredCourseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesiredCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
