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

  constructor(private dataService: DataService, private fb: FormBuilder) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.user = JSON.parse(userData);

      this.dataService.getUserDetails(this.user.id).subscribe(
        (userDetails: any) => {
          this.user = { ...this.user, ...userDetails };
          this.dataService.getUserAddDetails(this.user.id).subscribe(
            (userInfo: any) => {
              this.userInfo = userInfo;
              this.initializeForm(); // Initialize form after fetching user info
            },
            (error) => {
              console.error('Error fetching additional user details:', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
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
    if (this.userInfo && this.user) {
      this.userInfo.user_id = this.user.id;

      this.dataService.insertUserInfo(this.userInfo).subscribe(
        (response: any) => {
          console.log('User info inserted successfully', response);
          // Handle success, e.g., show a success message
        },
        (error) => {
          console.error('Error inserting user info:', error);
          // Handle error, e.g., show an error message
        }
      );
    } else {
      console.error('User or User info is null or undefined');
      // Handle scenario where user or user info is not properly fetched
    }
  }
}