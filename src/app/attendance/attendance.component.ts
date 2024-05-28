import { Component, OnInit, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../service/data.service';
import { Location } from '@angular/common'; // Import Location service

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  form!: FormGroup;
  eventId: string = '';
  eventName: string = '';

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder, 
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location // Inject Location service
  ) { }

  ngOnInit() {
    this.initializeForm(); // Initialize the form

    this.route.paramMap.subscribe(params => {
        this.eventId = params.get('eventId')!;
        this.fetchEventDetails(this.eventId);
    });
  }

  initializeForm() {
    this.form = this.fb.group({
        l_name: ['', Validators.required],
        f_name: ['', Validators.required],
        address: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        p_number: ['', Validators.required]
    });
  }

  fetchEventDetails(eventId: string) {
    this.dataService.getEventDetails(eventId).subscribe(
        (eventDetails: any) => {
            // console.log('Event Details:', eventDetails);
            const firstEvent = eventDetails?.payload?.[0]; // Access the first event if exists
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

    const data = {
        event_id: this.eventId,
        l_name: this.form.value.l_name,
        f_name: this.form.value.f_name,
        address: this.form.value.address,
        email: this.form.value.email,
        p_number: this.form.value.p_number,
        attendance_date: new Date().toISOString().slice(0, 10)
    };

    // Check if attendance has already been submitted for this event
    this.dataService.getAttendanceForEvent(this.eventId).subscribe(
        (response: any) => {
            // console.log('Attendance check response:', response);
            if (response && response.status === 'success' && response.data.attendance_exists) {
                this.openSnackBar('You have already registered for this event.');
            } else {
                // Proceed with submitting attendance
                this.submitAttendance(data);
            }
        },
        error => {
            console.error('Failed to check attendance:', error);
            this.openSnackBar('Failed to check attendance');
        }
    );
}

submitAttendance(data: any) {
    this.dataService.submitAttendance(data).subscribe(
        response => {
            // console.log('Response:', response); // Log the response for debugging
            if (response && response.status === 'success') {
                console.log('Attendance submitted successfully:', response);
                this.form.reset();
                this.openSnackBar('Attendance submitted successfully');
            } else {
                // console.error('Failed to submit attendance:', response);
                this.openSnackBar('You have already registered for this event.');
            }
        },
        error => {
            console.error('Failed to submit attendance:', error);
            this.openSnackBar('Failed to submit attendance');
        }
    );
}

openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
        duration: 3000, // Snackbar duration in milliseconds
    });
}



  goBack() {
    this.location.back(); // Use the Location service to go back
  }
}

@NgModule({
  imports: [ReactiveFormsModule, MatSnackBarModule],
  declarations: [AttendanceComponent]
})
export class AttendanceModule {}
