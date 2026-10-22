/*
Title: app.component.ts
Author: Professor Krasso
Date: 02/12/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: app root component
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./app.component.css']
})
export class AppComponent {

}
