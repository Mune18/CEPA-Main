import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../service/data.service';
import { CommonModule, DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-viewsubmission',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatGridListModule,
    CommonModule,
  ],
  templateUrl: './viewsubmission.component.html',
  styleUrls: ['./viewsubmission.component.css'],
  providers: [DatePipe], // Provide DatePipe here
})
export class ViewsubmissionComponent implements OnInit {
  eventId: string = '';
  eventName: string = '';
  submissions: any[] = []; // Array to hold submissions
  currentIndex: number = 0; // Index to track the current submission
  selectedStatus: string = ''; // Track selected status
  message: string = ''; // Track message
  currentStatus: string = ''; // Track current status

  constructor(
    private snackBar: MatSnackBar,
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location,
    private datePipe: DatePipe // Inject DatePipe
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.eventId = params.get('eventId')!;
      this.fetchSubmissions(this.eventId); // Fetch submissions for the eventId
    });
  }

  fetchSubmissions(eventId: string) {
    this.dataService.getSubmissions(eventId).subscribe(
      (submissions: any[]) => {
        console.log('These are the submissions', submissions);
        this.submissions = submissions.map((submission) => {
          return {
            ...submission,
            formattedUploadTimestamp: this.datePipe.transform(
              submission.upload_timestamp,
              'MMMM d, yyyy hh:mm a'
            ),
          };
        }); // Update submissions array with formatted timestamp
        if (this.submissions.length > 0) {
          this.updateCurrentSubmissionData();
        }
      },
      (error) => {
        console.error('Failed to fetch submissions:', error);
      }
    );
  }

  updateCurrentSubmissionData() {
    this.selectedStatus = this.submissions[this.currentIndex].status || '';
    this.currentStatus = this.selectedStatus;
    this.message = this.submissions[this.currentIndex].message || '';
  }

  goBack() {
    this.location.back();
  }

  getImageUrl(): string {
    if (
      this.submissions &&
      this.submissions[this.currentIndex] &&
      this.submissions[this.currentIndex].attendance_proof
    ) {
      return this.dataService.getFullImageUrl(
        this.submissions[this.currentIndex].attendance_proof
      );
    }
    return ''; // Or default image URL if attendance_proof is not available
  }

  showNext() {
    if (this.currentIndex < this.submissions.length - 1) {
      this.currentIndex++;
      this.updateCurrentSubmissionData();
    }
  }

  showPrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCurrentSubmissionData();
    }
  }

  updateStatus() {
    if (this.selectedStatus === 'Reject' && !this.message) {
      this.snackBar.open('Message is required when rejecting', 'Close', {
        duration: 3000,
      });
      return;
    }

    const submissionId = this.submissions[this.currentIndex].id;
    const statusMessage = this.selectedStatus === 'Approved' ? '' : this.message;
    
    this.dataService.updateStatus(submissionId, this.selectedStatus, statusMessage).subscribe(
      (response) => {
        this.snackBar.open('Status updated successfully', 'Close', {
          duration: 3000,
        });
        console.log('Update response:', response);
        this.currentStatus = this.selectedStatus;
        this.submissions[this.currentIndex].status = this.selectedStatus;
        this.submissions[this.currentIndex].message = statusMessage;
      },
      (error) => {
        this.snackBar.open('Failed to update status', 'Close', {
          duration: 3000,
        });
        console.error('Update error:', error);
      }
    );
  }
}
