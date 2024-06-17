import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../service/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  userInfo: any = {};
  userForm!: FormGroup;
  eventsJoined: any[] = []; // Initialize as an empty array

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.user = JSON.parse(userData);
  
      // Fetch user details and additional user info
      this.dataService.getUserDetails(this.user.id).subscribe(
        (userDetails: any) => {
          const { password, ...detailsWithoutPassword } = userDetails;  // Exclude password
          this.user = { ...this.user, ...detailsWithoutPassword };
  
          // Fetch additional user info
          this.dataService.getUserAddDetails(this.user.id).subscribe(
            (userInfo: any) => {
              this.userInfo = userInfo;
              this.dataService.setUserInfo(userInfo); // Set user info in shared service
              this.initializeForm(); // Initialize form after fetching user info
            },
            (error) => {
              console.error('Error fetching additional user details:', error);
            }
          );
  
          this.dataService.getEventsJoined(this.user.id).subscribe(
            (events: any[]) => {
                this.eventsJoined = events;
                console.log('Events Joined:', this.eventsJoined);
            },
            (error) => {
                console.error('Error fetching events joined:', error);
            }
          );        
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    } else {
      this.initializeForm(); // Initialize form if no user data is found
    }
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      college_program: [this.userInfo?.college_program || ''],
      phone_number: [this.userInfo?.phone_number || ''],
      date_of_birth: [this.userInfo?.date_of_birth || ''],
      place_of_birth: [this.userInfo?.place_of_birth || ''],
      gender: [this.userInfo?.gender || ''],
      sexual_orientation: [this.userInfo?.sexual_orientation || ''],
      gender_identity: [this.userInfo?.gender_identity || '']
    });
  }

  insertUserInfo(): void {
    if (this.userForm.valid) {
      const userInfo = {
        ...this.userInfo,
        ...this.userForm.value,
        user_id: this.user.id
      };

      this.dataService.insertUserInfo(userInfo).subscribe(
        (response: any) => {
          console.log('User info inserted/updated successfully', response);
          this.snackBar.open('User info updated successfully', 'Close', { duration: 3000 });
          this.dataService.setUserInfo(userInfo); // Update user info in shared service

          // Fetch and display the updated data
          this.dataService.getUserAddDetails(this.user.id).subscribe(
            (updatedUserInfo: any) => {
              this.userInfo = updatedUserInfo;
              this.dataService.setUserInfo(updatedUserInfo); // Update user info in shared service
              this.initializeForm(); // Reinitialize form with updated data
            },
            (error) => {
              console.error('Error fetching updated user details:', error);
            }
          );
        },
        (error) => {
          console.error('Error inserting/updating user info:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
}