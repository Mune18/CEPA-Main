import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-searchparticipant',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule, MatCardModule],
  templateUrl: './searchparticipant.component.html',
  styleUrls: ['./searchparticipant.component.css']
})
export class SearchparticipantComponent {
  searchQuery: string = '';
  participants: any[] = [];

  constructor(
    private dataService: DataService,
    private _snackBar: MatSnackBar
  ) {}

  searchParticipant() {
    if (this.searchQuery.trim()) {
      this.dataService.searchParticipant(this.searchQuery).subscribe((data: any[]) => {
        if (data.length > 0) {
          this.participants = data;
          console.log(this.participants); // Log the participants data for debugging
        } else {
          this.participants = [];
          this.openSnackBar('No participants found');
        }
      });
    } else {
      this.participants = [];
    }
  }
  

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      duration: 3000 // Set duration for the snackbar
    });
  }
}
