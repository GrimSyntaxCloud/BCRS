/*
 Title: home.component.ts
 Author: Professor Krasso
 Updated Date: 02/21/2023
 Modified By: Andres Macias/Patrick Wolff/April Yang
 Description: Home page component
 */


import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
