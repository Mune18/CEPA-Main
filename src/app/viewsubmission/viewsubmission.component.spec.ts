import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsubmissionComponent } from './viewsubmission.component';

describe('ViewsubmissionComponent', () => {
  let component: ViewsubmissionComponent;
  let fixture: ComponentFixture<ViewsubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewsubmissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewsubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
