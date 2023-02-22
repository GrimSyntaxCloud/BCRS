import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseLayoutComponent } from "./shared/base-layout/base-layout.component";
import { LoginComponent } from "./pages/login/login.component";
import { AuthGuard } from './auth.guard';
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { SecurityQuestionListComponent } from './pages/security-question-list/security-question-list.component';
import { SecurityQuestionDetailsComponent } from './pages/security-question-details/security-question-details.component';
import { ServiceRepairComponent } from './pages/service-repair/service-repair.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { VerifySecurityQuestionsFormComponent } from './shared/forms/verify-security-questions-form/verify-security-questions-form.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ResetPasswordFormComponent } from './shared/forms/reset-password-form/reset-password-form.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ErrorComponent } from './pages/error/error.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { AboutComponent } from './pages/about/about.component';
import { VerifyUsernameFormComponent } from './shared/forms/verify-username-form/verify-username-form.component';
import { UserListComponent } from './pages/user-list/user-list.component';


const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'service-repair',
        component: ServiceRepairComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'security-questions',
        component: SecurityQuestionListComponent,
        canActivate: [AuthGuard] // for logged in user
      },
      {
        path: 'security-questions/:questionId',
        component: SecurityQuestionDetailsComponent,
        canActivate: [AuthGuard]  // for logged in user
      },
      {
      path: 'users/:userName',
      component: UserDetailsComponent,
      canActivate: [AuthGuard] // for logged in user
      }
    ],
  },
  {
    path: 'session',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'forgot',
        component: VerifyUsernameFormComponent,
      },
      {
        path: 'verify-security-questions',
        component: VerifySecurityQuestionsFormComponent,
      },
      {
        path: 'reset-password',
        component: ResetPasswordFormComponent,
      },
      {
        path: 'not-found',
        component: NotFoundComponent
      },
      {
        path: 'error-500',
        component: ErrorComponent,
      },
      {
        path: 'user-list',
        component: UserListComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'session/not-found'
  }

];

@NgModule({
  /**
   * Description: UseHash: true, enableTracing: false, scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy'
   * UseHash: true - This is used to enable the hash location strategy.
   * enableTracing: false - This is used to enable the router events.
   * scrollPositionRestoration: 'enabled' - This is used to enable the scroll position restoration.
  * relativeLinkResolution: 'legacy' - This is used to enable the legacy relative link resolution. Because of this, the router will use the first route that matches the URL.
   */
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false, scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
