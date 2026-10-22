/*
 Title: error.component.ts
 Author: Professor Krasso
 Date: 02/19/2023
 Modified By: Andres Macias/Patrick Wolff/April Yang
 Description: error 500 page component
 */


import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-error',
  templateUrl: './error.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
