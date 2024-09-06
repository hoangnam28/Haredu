import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesOpenComponent } from './classes-open.component';

describe('ClassesOpenComponent', () => {
  let component: ClassesOpenComponent;
  let fixture: ComponentFixture<ClassesOpenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassesOpenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassesOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
