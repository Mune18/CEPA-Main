import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './Admin/home/home.component';
import { ParticipantmanagementComponent } from './Admin/participantmanagement/participantmanagement.component';
import { EventmanagementComponent } from './Admin/eventmanagement/eventmanagement.component';
import { AboutusComponent } from './User/aboutus/aboutus.component';
import { LoginComponent } from './Admin/login/login.component';
import { SidenavComponent } from './Admin/sidenav/sidenav.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { MailerComponent } from './Admin/mailer/mailer.component';
import { UserhomeComponent } from './User/userhome/userhome.component';
import { UsersidenavComponent } from './User/usersidenav/usersidenav.component';
import { SearchparticipantComponent } from './User/searchparticipant/searchparticipant.component';
import { FeedbackComponent } from './User/feedback/feedback.component';
import { AdminAuthGuard } from './service/login/auth.guard';
import { AdminFeedbackComponent } from './Admin/feedback/feedback.component';
import { UserloginComponent } from './User/userlogin/userlogin.component';
import { UserAuthGuard } from './service/login/userauth.guard';
import { ProfileComponent } from './User/profile/profile.component';
import { ViewsubmissionComponent } from './viewsubmission/viewsubmission.component';

export const routes: Routes = [
  {
    path: 'admin/login',
    component: LoginComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'user/login',
    component: UserloginComponent,
    canActivate: [UserAuthGuard]
  },
  {
    path: 'attendance/:eventId',
    component: AttendanceComponent,
    canActivate: [UserAuthGuard]
  },
  {
  
    path: 'viewsubmission/:eventId',
    component: ViewsubmissionComponent,
    canActivate: [AdminAuthGuard],
  },    
  {
    path: '',
    redirectTo: 'user/home',
    pathMatch: 'full',
  },
  {
    path: 'user',
    component: UsersidenavComponent,
    canActivate: [UserAuthGuard],
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'home',
        component: UserhomeComponent,
      },
      {
        path: 'feedback',
        component: FeedbackComponent,
      },
      {
        path: 'aboutus',
        component: AboutusComponent,
      },
    ]
  },
  {
    path: 'admin',
    component: SidenavComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'eventmanagement',
        component: EventmanagementComponent,
      },
      {
        path: 'participantmanagement',
        component: ParticipantmanagementComponent,
      },
      {
        path: 'mailer',
        component: MailerComponent,
      },
      {
        path: 'searchparticipant',
        component: SearchparticipantComponent,
      },
      {
        path: 'feedback',
        component: AdminFeedbackComponent,
      },
      
    ],
  },
  {
    path: '**',
    redirectTo: 'user/home',
  },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]

    
})
export class AppRoutingModule { }