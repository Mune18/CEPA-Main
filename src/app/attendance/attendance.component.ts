import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../service/data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, MatSnackBarModule],
})
export class AttendanceComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  form!: FormGroup;
  eventId: string = '';
  eventName: string = '';
  userInfo: any = {};
  userName: string = ''; // Change to string type

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder, 
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location // Inject Location service
  ) { }

  ngOnInit() {
    this.initializeForm();
  
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('eventId')!;
      // console.log('Event ID:', this.eventId);
      this.fetchEventDetails(this.eventId);
  
      // Fetch user details
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        this.dataService.getUserDetails(user.id).subscribe(
          (userDetails: any) => {
            this.userInfo = userDetails;
            this.userName = `${userDetails.firstname} ${userDetails.lastname}`; // Assuming firstname and lastname are fields in userDetails
  
            // Fetch event details
            this.dataService.getEventDetails(this.eventId).subscribe(
              (eventDetails: any) => {
                const firstEvent = eventDetails?.payload?.find((event: any) => event.event_id === parseInt(this.eventId, 10));
                if (firstEvent && 'event_name' in firstEvent) {
                  this.eventName = firstEvent.event_name;
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
  

  initializeForm() {
    this.form = this.fb.group({
        feedback: ['', Validators.required],
        attendanceProof: [''] // Adjust validators or additional processing as needed
    });
  }

  fetchEventDetails(eventId: string) {
    this.dataService.getEventDetails(eventId).subscribe(
        (eventDetails: any) => {
            // console.log('Event Details:', eventDetails); // Log event details
            const firstEvent = eventDetails?.payload?.find((event: any) => event.event_id === parseInt(eventId));
            if (firstEvent && 'event_name' in firstEvent) {
                this.eventName = firstEvent.event_name;
            } else {
                console.error('Event name property not found in event details.');
            }
        },
        error => {
            console.error('Failed to fetch event details:', error);
            // Handle error, show error message, etc.
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
    formData.append('event_name', this.eventName); // Add event_name to FormData
    formData.append('feedback', this.form.value.feedback);
    formData.append('status', 'pending'); // Add status field
    
    const fileInput = this.fileInput.nativeElement;
    if (fileInput.files.length > 0) {
      formData.append('attendance_proof', fileInput.files[0]);
    } else {
      formData.append('attendance_proof', '');
    }
  
    formData.append('uploaded_by', this.userName); // Add uploaded_by as the user's name

    // Log FormData key-value pairs
    // this.logFormData(formData);
  
    this.dataService.submitAttendance(formData).subscribe(
      response => {
        this.form.reset(); // Reset the form
        this.openSnackBar('Feedback submitted successfully'); // Display success message
      },
      error => {
        if (error === "Feedback submission failed.") {
          this.openSnackBar(error);
          this.form.reset();
        } else {
          this.openSnackBar('Failed to submit feedback');
        }
      }
    );
  }

  // logFormData(formData: any) {
  //   for (const pair of formData.entries()) {
  //     console.log(`${pair[0]}: ${pair[1]}`);
  //   }
  // }
  

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
        duration: 3000, // Snackbar duration in milliseconds
    });
  }

  goBack() {
    this.location.back(); // Use the Location service to go back
  }
}
