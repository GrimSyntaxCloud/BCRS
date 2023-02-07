import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { BaseLayoutComponent } from './shared/base-layout/base-layout.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './pages/login/login.component';

/**
 * Description: Importing the Material Card Module. This is used to display cards for the application.
 * link: https://material.angular.io/components/card/overview
 */
import {MatCardModule} from '@angular/material/card';

/**
 * Description: Importing the Material Form Field Module. This is used to display form fields for the application.
 * link: https://material.angular.io/components/form-field/overview
 */
import {MatFormFieldModule} from '@angular/material/form-field';

/**
 * Description: Importing the Material Input Module. This is used to display input fields for the application.
 * link: https://material.angular.io/components/input/overview
 * note: This is a sub-module of the Material Form Field Module. Without the Material Form Field Module, this will not work.
 */
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthLayoutComponent,
    BaseLayoutComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
