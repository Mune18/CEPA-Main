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

  constructor(private dataService: DataService, private snackBar: MatSnackBar, private router: Router) {}

  toggleForm(event: Event) {
    event.preventDefault();
    this.isLogin = !this.isLogin;
  }

  onSubmitLogin(event: Event) {
    event.preventDefault();
    this.dataService.userLogin(this.idnumber, this.password).subscribe(
      success => {
        if (success) {
          this.router.navigate(['/user/home']);
        } else {
          this.snackBar.open('Login failed. Please check your ID and password.', 'Close', {
            duration: 3000,
          });
        }
      },
      error => {
        console.error('Login error', error);
        this.snackBar.open('Login failed. Please try again.', 'Close', {
          duration: 3000,
        });
      }
    );
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
      firstname: this.firstname,
      lastname: this.lastname,
      idnumber: this.idnumber,
      email: this.email,
      password: this.password,
      gender: this.gender,
    };

    this.dataService.register(user).subscribe(
      response => {
        if (response.status === 'success') {
          console.log('Registration successful', response);
          this.snackBar.open('Registered successfully!', 'Close', {
            duration: 3000,
          });
          this.resetSignUpForm();
          this.isLogin = true;
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

  resetSignUpForm() {
    this.firstname = '';
    this.lastname = '';
    this.idnumber = '';
    this.email = '';
    this.password = '';
    this.retypePassword = '';
    this.gender = '';
  }
}
