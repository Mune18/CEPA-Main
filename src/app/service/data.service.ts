import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://api.itcepacommunity.com/routes.php?request=';
  private eventsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient, private router: Router) {}

  // AuthService Methods
  login(id: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}login`, { id, password }).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          return true;
        } else {
          return false;
        }
      }),
      catchError(this.handleError)
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/admin/login']);
  }

  // AttendanceService Methods
  submitAttendance(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}attendance`, data);
  }

  getAttendanceForEvent(eventId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getattendees/${eventId}`);
  }

  // EmailService Method
  sendEmail(emailData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}sendemail`, emailData);
  }

  // EventService Methods
  addEvent(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}addevent`, data);
  }

  getAllEventsUser(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}getevent_user`);
  }

  getAllEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}getevent`);
  }

  getEventDetails(eventId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getevent/${eventId}`);
  }

  updateEventDetails(eventId: number, eventData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}update_event/${eventId}`, eventData);
  }

  archiveEvent(eventId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}archive_event/${eventId}`, null);
  }

  getEventsWithParticipantCounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}get_events_with_participant_counts`);
  }

  // FeedbackService Methods
  submitFeedback(feedbackData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}submitfeedback`, feedbackData).pipe(
      catchError(this.handleError)
    );
  }

  // HomeService Methods
  getParticipantCount(): Observable<any> {
    console.log('Fetching participant count...');
    return this.http.get<any>(`${this.apiUrl}home_totalParticipants`);
  }

  getEventCount(): Observable<any> {
    console.log('Fetching event count...');
    return this.http.get<any>(`${this.apiUrl}home_totalEvents`);
  }

  getMostParticipatedEvent(): Observable<any> {
    console.log('Fetching most participated event...');
    return this.http.get<any>(`${this.apiUrl}mostparticipatedevent`);
  }

  // ParticipantManagementService Methods
  getParticipants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}getinfo`);
  }

  getSearchParticipant(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?query=${query}`);
  }

  editParticipant(participant: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}editparticipant`, participant);
  }

  archiveParticipant(participant: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}archiveparticipant`, participant);
  }

  updateParticipantDetails(participantId: number, participantData: any): Observable<any> {
    console.log('Updating participant with ID:', participantId);
    return this.http.post<any>(`${this.apiUrl}update_participant/${participantId}`, participantData);
  }

  // SearchParticipantService Methods
  searchParticipant(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getparticipant&name=${name}`);
  }

  // AdminFeedbackService Methods
  getFeedbackData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}getfeedbackdata`).pipe(
      catchError(this.handleError)
    );
  }

  // Error Handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
