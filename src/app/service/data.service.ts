import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap,tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost/CEPA-Main/cepaapi/api/';
  private apiImageUrl = 'http://localhost/CEPA-Main/cepaapi/api/';
  private eventsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private userInfoSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null); // Add user info subject

  constructor(private http: HttpClient, private router: Router) {}

  // AuthService Methods
  userLogin(idnumber: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}userlogin`, { idnumber, password }).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', 'Student'); // Save user role
          // Save only necessary user information
          const minimalUserData = {
            id: response.user.id,
            name: `${response.user.firstname} ${response.user.lastname}`
          };
          localStorage.setItem('currentUser', JSON.stringify(minimalUserData)); // Save minimal user information
          return minimalUserData; // Return minimal user information
        } else {
          return false;
        }
      }),
      catchError(this.handleError)
    );
  }

  adminLogin(id: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}adminlogin`, { id, password }).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', 'admin'); // Save admin role
          return true;
        } else {
          return false;
        }
      }),
      catchError(this.handleError)
    );
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}register`, user).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Method to get the role of the logged-in user
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  adminLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/admin/login']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/user/login']);
  }

  // AttendanceService Methods
  submitAttendance(FormData: any): Observable<any> {
    // console.log('this is the data', FormData); // Ensure data is populated correctly here
    return this.http.post<any>(`${this.apiUrl}attendance`, FormData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error submitting attendance:', error);
        return throwError('Error submitting attendance. Please try again later.');
      })
    );
  }
  
  getAttendanceForEvent(eventId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getattendees/${eventId}`);
  }

  deleteUserFromEvent(eventId: number, userId: number): Observable<any> {
    const url = `${this.apiUrl}/deleteuserfromevent/${eventId}/${userId}`;
    return this.http.delete(url, { responseType: 'text' }).pipe(
        // tap((response: string) => console.log('Response:', response)), // Specify response type
        catchError(this.handleError)
    );
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

  getSubmissions(eventId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}getsubmissions/${eventId}`).pipe(
      catchError(this.handleError)
    );
  }  

  // Fetch user Details
  getUserDetails(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getuserdetails/${userId}`);
  }

  getUserAddDetails(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getuseradddetails/${userId}`);
  }

  getSubmittedData(eventId: string, userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getsubmission?event_id=${eventId}&user_id=${userId}`);
  }

  getFullImageUrl(imagePath: string): string {
    return `${this.apiImageUrl}${imagePath}`;
  }

  getEventsJoined(userId: number): Observable<Event[]> {
    return this.http.get<any[]>(`${this.apiUrl}geteventsjoined/${userId}`).pipe(
      map((response: any) => {
        if (response.status === 'success') {
          return response.data.map((event: any) => ({
            event_id: event.event_id,
            event_name: event.event_name,
            event_date: event.event_date,
            event_location: event.event_location,
            organizer: event.organizer
          }));
        } else {
          throw new Error('Failed to fetch events joined');
        }
      })
    );
  }

  insertUserInfo(userInfo: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}insertuserinfo`, userInfo).pipe(
      catchError(this.handleError)
    );
  }

  sendUserInfo(userInfoToSend: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrationforevent`, userInfoToSend).pipe(
      catchError(this.handleError)
    );
  }

  
  // Methods to handle user info
  setUserInfo(userInfo: any): void {
    this.userInfoSubject.next(userInfo);
  }

  getUserInfo(): Observable<any> {
    return this.userInfoSubject.asObservable();
  }
  getParticipantInfo(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getparticipantinfo/${userId}`);
}
  

  //Update User Submission Status
  updateStatus(submissionId: number, status: string, message: string): Observable<any> {
    const payload = { status, message };
    return this.http.post<any>(`${this.apiUrl}update_status/${submissionId}`, payload).pipe(
      catchError(this.handleError)
    );
  }

  getAttendeesForEvent(eventId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getattendeeslist/${eventId}`);
  }

  getAttendanceProofData(eventId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getattendanceproofdata/${eventId}`);
}

getRegistrantsForEvent(eventId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}events/${eventId}/registrants`).pipe(
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