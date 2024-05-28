import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DataService } from '../../service/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class AdminFeedbackComponent implements OnInit {
  feedbackData: any[] = [];
  showTooltip: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchFeedbackData();
  }

  fetchFeedbackData(): void {
    this.dataService.getFeedbackData().subscribe(
      (data: any[]) => {
        this.feedbackData = data;
      },
      (error) => {
        console.error('Error fetching feedback data:', error);
      }
    );
  }

  toggleTooltip(question: string): void {
    if (this.showTooltip === question) {
      this.showTooltip = null;
    } else {
      this.showTooltip = question;
    }
  }
}
