import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingDemoComponent } from './meeting-demo.component';

describe('MeetingDemoComponent', () => {
  let component: MeetingDemoComponent;
  let fixture: ComponentFixture<MeetingDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingDemoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeetingDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
