import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { QRCodeModule } from 'angularx-qrcode';
import { CommonModule } from '@angular/common';
import { QRCodeService } from '../../../service/qr-code.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateValidator } from '../../../service/date-validator.service';
import { DataService } from '../../../service/data.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ParticipantInfoDialogComponent } from '../participant-info-dialog/participant-info-dialog.component';

@Component({
  selector: 'app-eventdetails', 
  standalone: true,
  imports: [CommonModule, MatTabsModule, RouterModule, MatTableModule, QRCodeModule, ReactiveFormsModule],
  templateUrl: './eventdetails.component.html',
  styleUrls: ['./eventdetails.component.css']
})
export class EventdetailsComponent {
  attendanceData: any[] = [];
  displayedColumnsRegistrants: string[] = ['name', 'email', 'gender'];
  displayedColumnsAttendance: string[] = ['uploaded_by', 'status'];
  qrCodeData: string | null = null;
  userInfo: any = {};
  attendees: any[] = [];
  updateForm: FormGroup;
  minDate: Date = new Date();
  dataSource: MatTableDataSource<any>; // Add this line
  displayedColumns: string[] = ['name', 'email', 'gender', 'action'];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private dialogRef: MatDialogRef<EventdetailsComponent>,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private qrCodeService: QRCodeService,
    private dialog: MatDialog
  ) {
    this.updateForm = this.formBuilder.group({
      event_name: [data.event_name || '', Validators.required],
      event_date: [data.event_date || '', [Validators.required]],
      event_location: [data.event_location || '', Validators.required],
      organizer: [data.organizer || '', Validators.required],
      description: [data.description || '', Validators.required]
    });
    this.dataSource = new MatTableDataSource(this.attendanceData);
  }

  ngOnInit() {
    this.fetchAttendanceData();
    this.generateQRCode();
    this.fetchUserInfo();
    this.fetchAttendees(); // Fetch attendees on component initialization
  }

  fetchAttendanceData() {
    this.dataService.getAttendanceForEvent(this.data.event_id).subscribe(
        (response: any) => {
            this.attendanceData = response;
            // console.log('Attendance Data:', this.attendanceData); // Add this line
        },
        error => {
            console.error('Failed to fetch attendance data:', error);
        }
    );
}

  generateQRCode() {
    this.qrCodeService.generateQRCodeData(this.data.event_id).subscribe(
      (qrCodeData: string) => {
        this.qrCodeData = qrCodeData;
      },
      error => {
        console.error('Failed to generate QR code data:', error);
      }
    );
  }

  fetchUserInfo() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      delete user.password; // Exclude password

      this.dataService.getUserDetails(user.id).subscribe(
        (userDetails: any) => {
          const { password, ...detailsWithoutPassword } = userDetails;  // Exclude password
          this.userInfo = { ...detailsWithoutPassword };
        },
        error => {
          console.error('Error fetching user details:', error);
        }
      );
    }
  }

  fetchAttendees() {
    this.dataService.getAttendanceProofData(this.data.event_id).subscribe(
      (response: any) => {
        this.attendees = response;
      },
      error => {
        console.error('Failed to fetch attendees:', error);
        this.snackBar.open('Failed to load attendees', 'Close', {
          duration: 3000
        });
      }
    );
  }

  updateEventDetails() {
    const updatedEventData = { ...this.data };
    for (const key in this.updateForm.controls) {
    if (this.updateForm.controls[key].dirty) {
    updatedEventData[key] = this.updateForm.controls[key].value;
    }
    }


    // Send the updated data
    this.dataService.updateEventDetails(this.data.event_id, updatedEventData).subscribe(
      (response: any) => {
        console.log('Event details updated successfully:', response);
        for (const key in updatedEventData) {
          this.data[key] = updatedEventData[key];
        }
      },
      error => {
        console.error('Failed to update event details:', error);
      }
    );
  }

  registerForEvent(): void {
    if (this.userInfo && this.userInfo.id) {
      const userInfoToSend = {
        ...this.userInfo,
        user_id: this.userInfo.id,
        event_id: this.data.event_id
      };

      this.dataService.sendUserInfo(userInfoToSend).subscribe(
        (response: any) => {
          let responseObject;
          try {
            responseObject = JSON.parse(response);
          } catch (e) {
            this.snackBar.open('Failed to register for the event', 'Close', { duration: 3000 });
            return;
          }

          if (responseObject.status === 'success' || !responseObject.status) {
            this.snackBar.open(responseObject.message || 'Registration completed successfully.', 'Close', { duration: 3000 });
          } else {
            this.snackBar.open(responseObject.message || 'Failed to register for the event', 'Close', { duration: 3000 });
          }
        },
        error => {
          const errorMessage = error.error?.message || 'Failed to register for the event';
          this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
        }
      );
    } else {
      console.error('User info is incomplete or missing');
      this.snackBar.open('User information is incomplete', 'Close', { duration: 3000 });
    }
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
      (events: any[]) => { },
      error => {
        console.error('Failed to fetch events:', error);
      }
    );
  }





  // ngOnInit() {
  //   // Fetch attendance data for the current event
  //   this.dataService.getAttendanceForEvent(this.data.event_id).subscribe(
  //     (response: any) => {
  //       this.attendanceData = response; // Assign fetched attendance data to attendanceData
  //     },
  //     error => {
  //       console.error('Failed to fetch attendance data:', error);
  //     }
  //   );

  //   // Generate QR code data for event registration
  //   this.qrCodeService.generateQRCodeData(this.data.event_id).subscribe(
  //     (qrCodeData: string) => {
  //       // console.log('QR Code Data:', qrCodeData);
  //       this.qrCodeData = qrCodeData; // Assign generated QR code data to qrCodeData
  //     },
  //     error => {
  //       console.error('Failed to generate QR code data:', error);
  //     }
  //   );
  // }

  

  goViewSubmissions() {
    // Check if data.event_id is defined
    if (this.data && this.data.event_id) {
      // Navigate to the attendance route with the event ID
      this.router.navigate(['/viewsubmission', this.data.event_id]).then(() => {
        this.dialogRef.close(); // Close the dialog after navigation
      });
    } else {
      console.error('Event ID is undefined or null.');
    }
  } 


  deleteUser(attendee: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this submitted registration?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteUserFromEvent(attendee.event_id, attendee.user_id).subscribe({
          next: (response) => {
            // console.log(`User deleted: ${response}`);
            if (response.message) {
              this.snackBar.open(`Registration deleted successfully: ${response.message}`, 'Close', { duration: 3000 });
            } else {
              this.snackBar.open('Registration deleted successfully.', 'Close', { duration: 3000 });
            }
            this.fetchAttendanceData();
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.snackBar.open(`Error deleting user: ${error.message}`, 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

viewParticipantInfo(attendee: any): void {
    this.dataService.getParticipantInfo(attendee.user_id).subscribe(
        (response: any) => {
            if (response.status === 'success') {
                this.dialog.open(ParticipantInfoDialogComponent, {
                    width: '700px',
                    height: 'auto',
                    data: response.data
                });
            } else {
                console.error('Error fetching participant info:', response.message);
            }
        },
        error => {
            console.error('Failed to fetch user info:', error);
        }
    );
}
}
  
