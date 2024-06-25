import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../service/data.service';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, MatSnackBarModule, CommonModule],
})
export class AttendanceComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  form!: FormGroup;
  eventId: string = '';
  eventName: string = '';
  userInfo: any = {};
  userName: string = '';
  userId: string = '';
  submittedData: any = [];

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.form = this.fb.group({
      feedback: ['', Validators.required],
      attendanceProof: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('eventId')!;
      this.fetchEventDetails(this.eventId);

      const userData = localStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        this.dataService.getUserDetails(user.id).subscribe(
          (userDetails: any) => {
            this.userInfo = userDetails;
            this.userName = `${userDetails.firstname} ${userDetails.lastname}`;
            this.userId = userDetails.id;

            this.dataService.getEventDetails(this.eventId).subscribe(
              (eventDetails: any) => {
                const firstEvent = eventDetails?.payload?.find((event: any) => event.event_id === parseInt(this.eventId, 10));
                if (firstEvent && 'event_name' in firstEvent) {
                  this.eventName = firstEvent.event_name;
                  this.loadSubmittedData();
                } else {
                  console.error('Event name property not found in event details.');
                }
              },
              (error) => {
                console.error('Error fetching event details:', error);
              }
            );
          },
          (error) => {
            console.error('Error fetching user details:', error);
          }
        );
      }
    });
  }

  loadSubmittedData() {
    this.dataService.getSubmittedData(this.eventId, this.userId).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.submittedData = response.data;
          // console.log('this is the data', this.submittedData);
          this.form.patchValue({
            feedback: this.submittedData.feedback
          });
        } else {
          console.error(response.message);
        }
      },
      (error) => {
        console.error('Error loading submitted data:', error);
      }
    );
  }

  fetchEventDetails(eventId: string) {
    this.dataService.getEventDetails(eventId).subscribe(
      (eventDetails: any) => {
        const firstEvent = eventDetails?.payload?.find((event: any) => event.event_id === parseInt(eventId));
        if (firstEvent && 'event_name' in firstEvent) {
          this.eventName = firstEvent.event_name;
        } else {
          console.error('Event name property not found in event details.');
        }
      },
      error => {
        console.error('Failed to fetch event details:', error);
      }
    );
  }

  onSubmit() {
    if (this.form.invalid) {
      this.openSnackBar('Please ensure all fields are filled out correctly.');
      return;
    }

    const formData = new FormData();
    formData.append('event_id', this.eventId);
    formData.append('event_name', this.eventName);
    formData.append('feedback', this.form.value.feedback);
    formData.append('user_id', this.userId);
    formData.append('status', 'Pending');

    const fileInput = this.fileInput.nativeElement;
    if (fileInput.files.length > 0) {
      formData.append('attendance_proof', fileInput.files[0], fileInput.files[0].name);
    } else {
      formData.append('attendance_proof', ''); // Or remove this line if not needed
    }
    

    formData.append('uploaded_by', this.userName);

    this.dataService.submitAttendance(formData).subscribe(
      () => {
        this.form.reset();
        this.openSnackBar('Feedback submitted successfully');

      // After successful submission, reload submitted data
      this.loadSubmittedData();
      },
      (error) => {
        if (error === "Feedback submission failed.") {
          this.openSnackBar(error);
          this.form.reset();
        } else {
          this.openSnackBar('Failed to submit feedback');
        }
      }
    );
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  goBack() {
    this.location.back();
  }

  getImageUrl(): string {
    if (this.submittedData && this.submittedData.attendance_proof) {
      return this.dataService.getFullImageUrl(this.submittedData.attendance_proof);
    }
    return ''; // Or default image URL if attendance_proof is not available
  }
}
