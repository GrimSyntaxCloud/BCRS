/*
Title: auth-layout.component.ts
Author: Professor Krasso
Updated Date: 02/12/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: auth-layout component
*/


import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./auth-layout.component.css']
})
export class AuthLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
