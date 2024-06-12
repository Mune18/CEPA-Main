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
  selector: 'app-usersidenav',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    FormsModule,
    MatCommonModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    CommonModule
  ],
  templateUrl: './usersidenav.component.html',
  styleUrl: './usersidenav.component.css'
})
export class UsersidenavComponent implements OnDestroy{
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

  navigateToHome() {
    this.router.navigate(['/user/userhome']);
  }
  
  navigateToFeedback() {
    this.router.navigate(['/user/feedback']);
  }

  navigateToAboutUs() {
    this.router.navigate(['/user/AboutUs']);
  }

  redirectToUserLogin() {
    this.dataService.logout();
  }
  ngOnInit(): void {    
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);
  }
}
