import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DataService } from '../../service/data.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormFieldModule, MatInput],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private dataService: DataService, private router: Router) { }

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.dataService.adminLogin(this.email, this.password).subscribe(
      success => {
        if (success) {
          this.router.navigate(['/admin/home']);
        } else {
          this.errorMessage = 'Invalid email or password. Please try again.';
        }
      },
      error => {
        console.error('Login error:', error);
        this.errorMessage = 'Login failed. Please try again later.';
      }
    );
  }
}