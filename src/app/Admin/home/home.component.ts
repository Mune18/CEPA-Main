import { Component } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../../service/data.service';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SidenavComponent,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  participantsCount = 0;
  eventsCount = 0;
  events: any[] = [];
  mostParticipatedEvent = '';
  mostParticipatedEventCount = 0;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.renderChart();
    this.fetchData();
  }

  renderChart() {
    this.dataService.getEventsWithParticipantCounts().subscribe(events => {
      this.events = events; // Store events for monthly report
      const labels = events.map(event => event.event_name);
      const participants = events.map(event => event.participant_count);
      const colors = this.generateRandomColors(events.length);

      const ctx = document.getElementById('barChart') as HTMLCanvasElement;
      const barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Number of Participants',
            data: participants,
            backgroundColor: colors,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      this.renderMonthlyReport(events); // Render monthly report with the fetched events
    });
  }

  renderMonthlyReport(events: any[]) {
    const monthlyData = this.calculateMonthlyData(events);
    const labels = Object.keys(monthlyData);
    const participants = labels.map(label => monthlyData[label].participants);
    const eventCounts = labels.map(label => monthlyData[label].events);
    const colors = this.generateRandomColors(labels.length);

    const ctx = document.getElementById('monthlyReportChart') as HTMLCanvasElement;
    const monthlyReportChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Participants',
          data: participants,
          backgroundColor: colors,
          borderColor: colors,
          fill: false,
          tension: 0.1
        }, {
          label: 'Events',
          data: eventCounts,
          backgroundColor: colors,
          borderColor: colors,
          fill: false,
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  calculateMonthlyData(events: any[]) {
    const monthlyData: { [key: string]: { participants: number, events: number } } = {};

    events.forEach(event => {
      const date = new Date(event.event_date);
      const month = date.toLocaleString('default', { month: 'long' });

      if (!monthlyData[month]) {
        monthlyData[month] = { participants: 0, events: 0 };
      }

      monthlyData[month].participants += event.participant_count;
      monthlyData[month].events += 1;
    });

    return monthlyData;
  }

  generateRandomColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const color = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.2)`;
      colors.push(color);
    }
    return colors;
  }

  private async fetchData(): Promise<void> {
    try {
      const participantResponse = await this.dataService.getParticipantCount().toPromise();
      const eventResponse = await this.dataService.getEventCount().toPromise();
      const mostParticipatedEventResponse = await this.dataService.getMostParticipatedEvent().toPromise();

      console.log('Participant Response:', participantResponse);
      console.log('Event Response:', eventResponse);
      console.log('Most Participated Event Response:', mostParticipatedEventResponse);

      if (participantResponse.payload) {
        this.participantsCount = participantResponse.payload.length;
      }

      if (eventResponse.payload) {
        this.eventsCount = eventResponse.payload.length;
        this.events = eventResponse.payload;
      }

      if (mostParticipatedEventResponse.event_name) {
        this.mostParticipatedEvent = mostParticipatedEventResponse.event_name;
        this.mostParticipatedEventCount = mostParticipatedEventResponse.participant_count;
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}