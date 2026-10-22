import { ConfirmationService } from './shared/services/confirmation.service';
import { MatDialog } from '@angular/material/dialog';
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppModule } from './app.module';
import { AppMessagesComponent } from './shared/app-messages.component';
import { RegisterComponent } from './pages/register/register.component';
import { HttpTestingController } from '@angular/common/http/testing';
import { LoginComponent } from './pages/login/login.component';

// Compile the real NgModule and Material templates, not just component classes.
describe('Angular framework migration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [provideHttpClientTesting(), ConfirmationService]
    }).compileComponents();
  });

  it('renders the existing login form with Material inputs and buttons', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('button[type="submit"]')).not.toBeNull();
  });

  it('validates registration and displays API errors through the real form', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();
    const submit = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
    fixture.componentInstance.form.setValue({ userName: 'angular_demo', password: 'Sample-test-password-2026', firstName: 'Demo', lastName: 'Customer' });
    fixture.detectChanges();
    expect(submit.disabled).toBe(false);
    submit.click();
    const request = TestBed.inject(HttpTestingController).expectOne('/api/session/register');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.userName).toBe('angular_demo');
    request.flush({ message: 'Username already exists.' }, { status: 409, statusText: 'Conflict' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Registration failed');
    expect(submit.disabled).toBe(false);
    TestBed.inject(HttpTestingController).verify();
  });

  it('keeps confirmation cancellation and acceptance separate with Angular Material', async () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    const accept = vi.fn();
    const reject = vi.fn();
    const service = TestBed.inject(ConfirmationService);
    const show = async () => {
      service.confirm({ message: 'Delete this sample record?', acceptLabel: 'Delete record', rejectLabel: 'Keep record', accept, reject });
      fixture.detectChanges();
      await fixture.whenStable();
    };
    const click = (label: string) => {
      const button = Array.from(document.querySelectorAll('mat-dialog-container button') as NodeListOf<HTMLButtonElement>)
        .find(element => element.textContent?.includes(label));
      expect(button).toBeDefined();
      button!.click();
      fixture.detectChanges();
    };
    await show();
    click('Keep record');
    await fixture.whenStable();
    await vi.waitFor(() => expect(reject).toHaveBeenCalledOnce());
    expect(accept).not.toHaveBeenCalled();
    await show();
    click('Delete record');
    await fixture.whenStable();
    await vi.waitFor(() => expect(accept).toHaveBeenCalledOnce());
    await show();
    TestBed.inject(MatDialog).closeAll();
    await fixture.whenStable();
    await vi.waitFor(() => expect(accept).toHaveBeenCalledOnce());
    await vi.waitFor(() => expect(reject).toHaveBeenCalledTimes(2));
  });

  it('renders validation text safely and preserves message dismissal', () => {
    const fixture = TestBed.createComponent(AppMessagesComponent);
    fixture.componentInstance.value = [{ severity: 'error', summary: 'Unable to save', detail: '<img src=x onerror=alert(1)>' }];
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Unable to save');
    expect(fixture.nativeElement.textContent).toContain('<img src=x onerror=alert(1)>');
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    let remaining: unknown;
    fixture.componentInstance.valueChange.subscribe(value => remaining = value);
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(remaining).toEqual([]);
    expect(fixture.nativeElement.querySelector('.app-message')).toBeNull();
  });
});
