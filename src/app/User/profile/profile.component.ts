import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../service/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {}; // Initialize an empty user object

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // Assuming you have stored the token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      this.dataService.getUserDetails(token).subscribe(
        response => {
          if (response.status === 'success') {
            this.user = response.user;
          } else {
            console.error('Failed to fetch user details:', response.message);
          }
        },
        error => {
          console.error('Error fetching user details:', error);
        }
      );
    }
  }
}