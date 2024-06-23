import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import {MatTableModule} from '@angular/material/table';
import { QRCodeService } from '../../../service/qr-code.service';
import { QRCodeModule } from 'angularx-qrcode';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../service/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-userhomedetails',
  standalone: true,
  imports: [CommonModule, MatTabsModule, RouterModule, MatTableModule, QRCodeModule, ReactiveFormsModule],
  templateUrl: './userhomedetails.component.html',
  styleUrl: './userhomedetails.component.css'
})
export class UserhomedetailsComponent {
  attendanceData: any[] = [];
  displayedColumnsRegistrants: string[] = ['l_name', 'f_name', 'email'];
  displayedColumnsAttendees: string[] = ['uploaded_by'];
  qrCodeData: string | null = null; // Variable to hold QR code data
  userInfo: any = {}; // To store user info
  attendees: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private dialogRef: MatDialogRef<UserhomedetailsComponent>,
    private dataService: DataService,
    private qrCodeService: QRCodeService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

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
    this.dataService.getAttendeesForEvent(this.data.event_id).subscribe(
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

  goToAttendance() {
    if (this.data && this.data.event_id) {
      this.router.navigate(['/attendance', this.data.event_id]).then(() => {
        this.dialogRef.close();
      });
    } else {
      console.error('Event ID is undefined or null.');
    }
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
}