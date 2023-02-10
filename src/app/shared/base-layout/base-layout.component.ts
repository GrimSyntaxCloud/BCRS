import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css']
})
export class BaseLayoutComponent implements OnInit {

  employeeName: string;
  year: number = Date.now();

  constructor(private cookieService: CookieService, private router: Router) {
     // from login component
    this.employeeName = this.cookieService.get('session_name');
    this.year = Date.now();
  }

  ngOnInit(): void {
  }

    // logout function deletes all cookies and navigate user to login page
  logout() {
    this.cookieService.deleteAll();
    this.router.navigate(['/session/login']);
  }

}
