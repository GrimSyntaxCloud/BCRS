/*
 Title: app.module.js
 Author: Professor Krasso
 Date: 02/07/2023
 Modified By: Andres Macias/Patrick Wolff/April Yang
 Description: Has all the imports and declarations for the app
 */


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


/* -------- Angular Materials -------- */
import { AppRoutingModule } from './app-routing.module';//
import { AppComponent } from './app.component';//
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';//
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http'; //
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; //
import { FlexLayoutModule } from '@angular/flex-layout'; //
import { MatToolbarModule } from '@angular/material/toolbar';//
import { MatButtonModule } from '@angular/material/button';//
import { MatIconModule } from '@angular/material/icon';//
import { MatMenuModule } from '@angular/material/menu'; //
import { MatCard, MatCardModule } from '@angular/material/card';//
import { MatFormFieldModule } from '@angular/material/form-field';//
import { MatInputModule } from '@angular/material/input';//
import { MatDialogModule } from '@angular/material/dialog'; //
import { MatTableModule } from '@angular/material/table'; //
import { MatDividerModule } from '@angular/material/divider';//
import { CookieService } from 'ngx-cookie-service';
import { MatGridListModule } from '@angular/material/grid-list';//
import { MatListModule } from '@angular/material/list';//
import {MatStepperModule} from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';

import { MatBadgeModule } from '@angular/material/badge';
import { MatCardActions } from '@angular/material/card';

/* -------- PrimeNg Materials -------- */
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

/* -------- Components -------- */
import { HomeComponent } from './pages/home/home.component';//
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';//
import { BaseLayoutComponent } from './shared/base-layout/base-layout.component';//
import { LoginComponent } from './pages/login/login.component'; //
import { SecurityQuestionListComponent } from './pages/security-question-list/security-question-list.component';
import { SecurityQuestionDetailsComponent } from './pages/security-question-details/security-question-details.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { DeleteRecordDialogComponent } from './shared/delete-record-dialog/delete-record-dialog.component';
import { UserCreateComponent } from './pages/user-create/user-create.component';
import { AboutComponent } from './pages/about/about.component';
import { ServiceRepairComponent } from './pages/service-repair/service-repair.component';
import { RegisterComponent } from './pages/register/register.component';
import { VerifySecurityQuestionsFormComponent } from './shared/forms/verify-security-questions-form/verify-security-questions-form.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ResetPasswordFormComponent } from './shared/forms/reset-password-form/reset-password-form.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ErrorComponent } from './pages/error/error.component';
import { ErrorInterceptor } from './shared/error.interceptor';
import { VerifyUsernameFormComponent } from './shared/forms/verify-username-form/verify-username-form.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { CartComponent } from './pages/cart/cart.component';
import { RoleListComponent } from './pages/role-list/role-list.component';
import { RoleDetailsComponent } from './pages/role-details/role-details.component';
import { PurchasesByServiceGraphComponent } from './pages/purchases-by-service-graph/purchases-by-service-graph.component';
import { ChartModule } from 'primeng/chart';
import { InvoiceSummaryDialogComponent } from './shared/invoice-summary-dialog/invoice-summary-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthLayoutComponent,
    BaseLayoutComponent,
    LoginComponent,
    SecurityQuestionListComponent,
    AuthLayoutComponent,
    SecurityQuestionDetailsComponent,
    UserDetailsComponent,
    DeleteRecordDialogComponent,
    AboutComponent,
    ServiceRepairComponent,
    RegisterComponent,
    VerifySecurityQuestionsFormComponent,
    NotFoundComponent,
    ResetPasswordFormComponent,
    ContactComponent,
    ErrorComponent,
    VerifyUsernameFormComponent,
    ProfileComponent,
    UserListComponent,
    UserCreateComponent,
    CartComponent,
    RoleListComponent,
    RoleDetailsComponent,
    PurchasesByServiceGraphComponent,
    InvoiceSummaryDialogComponent

  ],
  imports: [
     // Angular Materials
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatDialogModule,
    MatTableModule,
    MatDividerModule,
    MatGridListModule,
    MatListModule,
    MatStepperModule,
    MatSelectModule,
    MatBadgeModule,
    // NgPrime Materials
    TableModule,
    MessageModule,
    MessagesModule,
    ButtonModule,
    ConfirmDialogModule,
    ChartModule,
    MatCheckboxModule

  ],

  providers: [
      CookieService,
      {
        provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true
      }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
