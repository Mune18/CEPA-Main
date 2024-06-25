import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantInfoDialogComponent } from './participant-info-dialog.component';

describe('ParticipantInfoDialogComponent', () => {
  let component: ParticipantInfoDialogComponent;
  let fixture: ComponentFixture<ParticipantInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantInfoDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipantInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
