import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-userlogin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './userlogin.component.html',
  styleUrl: './userlogin.component.css'
})
export class UserloginComponent {
  isLogin = true;
  password: string = '';
  retypePassword: string = ''; // Added property for retype password
  showPassword: boolean = false; // Added property for toggling password visibility

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
    console.log('Sign up form submitted');
    // Handle sign up logic here
  }

  passwordsMatch(password: string, retypePassword: string): boolean {
    return password === retypePassword;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
