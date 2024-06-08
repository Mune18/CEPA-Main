import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../service/data.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userlogin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './userlogin.component.html',
  styleUrl: './userlogin.component.css'
})
export class UserloginComponent {
  isLogin = true;
  firstname: string = '';
  lastname: string = '';
  idnumber: string = '';
  email: string = '';
  password: string = '';
  retypePassword: string = '';
  gender: string = '';
  showPassword: boolean = false;

  constructor(private dataService: DataService, private snackBar: MatSnackBar) {}

  toggleForm(event: Event) {
    event.preventDefault();
    this.isLogin = !this.isLogin;
  }

  onSubmitLogin(event: Event) {
    event.preventDefault();
    console.log('Login form submitted');
    // Handle login logic here
  }

  onSubmitSignUp(event: Event) {
    event.preventDefault();
    if (!this.passwordsMatch(this.password, this.retypePassword)) {
      console.error('Passwords do not match');
      this.snackBar.open('Passwords do not match', 'Close', {
        duration: 3000,
      });
      return;
    }

    const user = {
      firstname: (document.getElementById('signup-firstname') as HTMLInputElement).value,
      lastname: (document.getElementById('signup-lastname') as HTMLInputElement).value,
      idnumber: (document.getElementById('signup-idnumber') as HTMLInputElement).value,
      email: (document.getElementById('signup-email') as HTMLInputElement).value,
      password: this.password,
      gender: (document.getElementById('signup-gender') as HTMLSelectElement).value,
    };

    this.dataService.register(user).subscribe(
      response => {
        if (response.status === 'success') {
          console.log('Registration successful', response);
          this.snackBar.open('Registered successfully!', 'Close', {
            duration: 3000,
          });
          this.resetSignUpForm(); // Reset the form fields here
        } else {
          console.error('Registration error', response);
          this.snackBar.open(response.message, 'Close', {
            duration: 3000,
          });
        }
      },
      error => {
        console.error('Registration failed', error);
        this.snackBar.open('Registration failed. Please try again.', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  passwordsMatch(password: string, retypePassword: string): boolean {
    return password === retypePassword;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Method to reset the sign-up form fields
  resetSignUpForm() {
    (document.getElementById('signup-firstname') as HTMLInputElement).value = '';
    (document.getElementById('signup-lastname') as HTMLInputElement).value = '';
    (document.getElementById('signup-idnumber') as HTMLInputElement).value = '';
    (document.getElementById('signup-email') as HTMLInputElement).value = '';
    this.password = '';
    this.retypePassword = '';
    (document.getElementById('signup-gender') as HTMLSelectElement).value = '';
  }
}
