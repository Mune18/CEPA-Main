import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import {MatCommonModule} from '@angular/material/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
      RouterOutlet,
      MatSidenavModule,
      FormsModule,
      MatCommonModule,
      MatToolbarModule,
      MatIconModule,
      MatListModule,
      CommonModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnDestroy{
  opened = true;
  currentDateTime = new Date();
  selectedNavItem = '';
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private router: Router,
    private dataService: DataService,
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);
  }

  navigateToHome() {
    this.router.navigate(['admin/home']);
    this.selectedNavItem = 'home';
  }

  navigateToEventManagement() {
    this.router.navigate(['admin/eventmanagement']);
    this.selectedNavItem = 'eventmanagement';
  }
  
  navigateToParticipantManagement() {
    this.router.navigate(['admin/participantmanagement']);
    this.selectedNavItem = 'participantmanagement';
  }

  navigateToMailer() {
    this.router.navigate(['admin/mailer']);
    this.selectedNavItem = 'mailer';
  }

  navigateToSearchParticipant() {
    this.router.navigate(['admin/searchparticipant']);
    this.selectedNavItem = 'searchparticipant';
  }
  
  navigateToFeedback() {
    this.router.navigate(['admin/feedback']);
    this.selectedNavItem = 'feedback';
  }

  redirectToAdminLogin() {
    this.dataService.adminLogout(); // Call logout method from DataService
  }
}
