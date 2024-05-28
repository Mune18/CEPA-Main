import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { QRCodeModule } from 'angularx-qrcode';
import { CommonModule } from '@angular/common';
import { QRCodeService } from '../../../service/qr-code.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateValidator } from '../../../service/date-validator.service';
import { DataService } from '../../../service/data.service';

@Component({
  selector: 'app-eventdetails',
  standalone: true,
  imports: [CommonModule, MatTabsModule, RouterModule, MatTableModule, QRCodeModule, ReactiveFormsModule],
  templateUrl: './eventdetails.component.html',
  styleUrl: './eventdetails.component.css'
})
export class EventdetailsComponent {
  attendanceData: any[] = [];
  displayedColumns: string[] = ['l_name', 'f_name', 'email'];
  qrCodeData: string | null = null; // Variable to hold QR code data
  updateForm: FormGroup;
  minDate: Date = new Date(); 
  dataSource: MatTableDataSource<any>; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private dialogRef: MatDialogRef<EventdetailsComponent>,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private dateValidator: DateValidator,
    private snackBar: MatSnackBar,
    private qrCodeService: QRCodeService
  ) {
    // Initialize form with current event data
    this.updateForm = this.formBuilder.group({
      event_name: [data.event_name || '', Validators.required],
      event_date: [data.event_date || '', [Validators.required, DateValidator.notPastDate(this.snackBar)]],
      event_location: [data.event_location || '', Validators.required],
      organizer: [data.organizer || '', Validators.required],
      description: [data.description || '', Validators.required]
    });
    this.dataSource = new MatTableDataSource(this.attendanceData);
  }
  

  updateEventDetails() {
    const updatedEventData = { ...this.data }; // Start with the existing data
    for (const key in this.updateForm.controls) {
      if (this.updateForm.controls[key].dirty) {
        updatedEventData[key] = this.updateForm.controls[key].value;
      }
    }
  
    // Send the updated data
    this.dataService.updateEventDetails(this.data.event_id, updatedEventData).subscribe(
      (response: any) => {
        console.log('Event details updated successfully:', response);
        // Update local data with updated fields
        for (const key in updatedEventData) {
          this.data[key] = updatedEventData[key];
        }
      },
      error => {
        console.error('Failed to update event details:', error);
      }
    );
  }  


deleteEvent() {
  if (confirm('Are you sure you want to delete this event?')) {
    this.dataService.archiveEvent(this.data.event_id).subscribe(
      (response: any) => {
        console.log('Event archived successfully:', response);
        this.dialogRef.close();
        window.location.reload();
      },
      error => {
        console.error('Failed to archive event:', error);
      }
    );
  }
}


reloadEvents() {
  this.dataService.getAllEvents().subscribe(
    (events: any[]) => {},
    error => {
      console.error('Failed to fetch events:', error);
    }
  );
}


fetchAttendanceData() {
  this.dataService.getAttendanceForEvent(this.data.event_id).subscribe(
    (response: any) => {
      this.attendanceData = response;
      this.dataSource.data = this.attendanceData; 
    },
    error => {
      console.error('Failed to fetch attendance data:', error);
    }
  );
}

  ngOnInit() {
    // Fetch attendance data for the current event
    this.dataService.getAttendanceForEvent(this.data.event_id).subscribe(
      (response: any) => {
        this.attendanceData = response; // Assign fetched attendance data to attendanceData
      },
      error => {
        console.error('Failed to fetch attendance data:', error);
      }
    );

    // Generate QR code data for event registration
    this.qrCodeService.generateQRCodeData(this.data.event_id).subscribe(
      (qrCodeData: string) => {
        // console.log('QR Code Data:', qrCodeData);
        this.qrCodeData = qrCodeData; // Assign generated QR code data to qrCodeData
      },
      error => {
        console.error('Failed to generate QR code data:', error);
      }
    );
  }

  goToAttendance() {
    // Check if data.event_id is defined
    if (this.data && this.data.event_id) {
      // Navigate to the attendance route with the event ID
      this.router.navigate(['/attendance', this.data.event_id]).then(() => {
        this.dialogRef.close(); // Close the dialog after navigation
      });
    } else {
      console.error('Event ID is undefined or null.');
    }
  } 
}