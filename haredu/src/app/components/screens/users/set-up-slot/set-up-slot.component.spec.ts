import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUpSlotComponent } from './set-up-slot.component';

describe('SetUpSlotComponent', () => {
  let component: SetUpSlotComponent;
  let fixture: ComponentFixture<SetUpSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetUpSlotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetUpSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
