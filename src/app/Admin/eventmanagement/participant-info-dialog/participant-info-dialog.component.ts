import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-participant-info-dialog',
  templateUrl: './participant-info-dialog.component.html',
  styleUrls: ['./participant-info-dialog.component.css']
})
export class ParticipantInfoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ParticipantInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
