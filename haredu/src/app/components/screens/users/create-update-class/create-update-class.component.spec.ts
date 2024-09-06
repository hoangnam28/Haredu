import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateClassComponent } from './create-update-class.component';

describe('CreateUpdateClassComponent', () => {
  let component: CreateUpdateClassComponent;
  let fixture: ComponentFixture<CreateUpdateClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateClassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateUpdateClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
