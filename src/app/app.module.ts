import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


/* -------- Angular Materials -------- */
import { AppRoutingModule } from './app-routing.module';//
import { AppComponent } from './app.component';//
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';//
import { HomeComponent } from './pages/home/home.component';//
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';//
import { BaseLayoutComponent } from './shared/base-layout/base-layout.component';//
import { HttpClientModule, HttpClient } from '@angular/common/http'; //
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
import { LoginComponent } from './pages/login/login.component'; //
import { CookieService } from 'ngx-cookie-service';
import {MatGridListModule} from '@angular/material/grid-list';//
// import { MatCardActions } from '@angular/material/card';

/* -------- PrimeNg Materials -------- */
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SecurityQuestionListComponent } from './pages/security-question-list/security-question-list.component';
import { SecurityQuestionDetailsComponent } from './pages/security-question-details/security-question-details.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { DeleteRecordDialogComponent } from './shared/delete-record-dialog/delete-record-dialog.component';
import { ConfirmationService } from 'primeng/api';
import { UserCreateComponent } from './pages/user-create/user-create.component';
import { AboutComponent } from './pages/about/about.component';
import { ServiceRepairComponent } from './pages/service-repair/service-repair.component';
import { RegisterComponent } from './pages/register/register.component';
import {MatStepperModule} from '@angular/material/stepper';

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
    RegisterComponent
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
    MatGridListModule,//
    // NgPrime Materials
    TableModule,
    MessageModule,
    MessagesModule,
    ButtonModule,
    ConfirmDialogModule,
    MatStepperModule
  ],

  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
