import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, throwError } from 'rxjs';
import { DataService } from '../../services/data.service';
import { LoginComponent } from './login.component';

const expectedErrorResponse = {
  status: 404,
  message: 'Not found'
};

class MockDataService {
  authenticateUser(username: string, password: string): Observable<boolean> {
    return of(false);
  }
}

@Component({
  selector: 'app-mock',
  template: ``
})
class MockComponent { }

const mockRoutes = [
  {
    path: 'login',
    component: MockComponent
  },
  {
    path: 'profile',
    component: MockComponent
  },
  {
    path: 'register_user',
    component: MockComponent
  }
];

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let dataService: DataService;
  let location: Location;
  const isLoggedIn = false;
  let emailCtrl: AbstractControl;
  let passwordCtrl: AbstractControl;
  let emailErrMsg = HTMLElement;
  let errorAlertNoPassword = HTMLElement;
  let errorAlertMinlengthPassword = HTMLElement;
  let errorAlertMaxlengthPassword = HTMLElement;
  let errorAlertPatternPassword = HTMLElement;
  let elemSubmitBtn = HTMLElement;
  let errorAlertUnauth = HTMLElement;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
        MockComponent
      ],
      imports: [
        RouterTestingModule.withRoutes(mockRoutes),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: DataService, useClass: MockDataService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    dataService = TestBed.get(DataService);
    location = TestBed.get(Location);

    emailErrMsg = fixture.nativeElement.querySelector('#error-email');
    errorAlertNoPassword = fixture.nativeElement.querySelector('#error-no-password');
    errorAlertMinlengthPassword = fixture.nativeElement.querySelector('#error-minlength-password');
    errorAlertMaxlengthPassword = fixture.nativeElement.querySelector('#error-maxlength-password');
    errorAlertPatternPassword = fixture.nativeElement.querySelector('#error-pattern-password');
    elemSubmitBtn = fixture.nativeElement.querySelector('#loginBtn');
    errorAlertUnauth = fixture.nativeElement.querySelector('#error-unauthorised-user');

    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
  });

  it('All validation errors should be hidden and form should be invalid by default', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.loginForm.valid).toBeFalsy();
      expect(emailErrMsg).toBeFalsy();
      expect(errorAlertNoPassword).toBeFalsy();
      expect(errorAlertMinlengthPassword).toBeFalsy();
      expect(errorAlertMaxlengthPassword).toBeFalsy();
      expect(errorAlertPatternPassword).toBeFalsy();
    });

  }));


  it('should display email pattern validation error', fakeAsync(() => {

    fixture.whenStable().then((() => {
      emailCtrl = component.loginForm.controls['email'];
      const elemInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
      elemInput.value = 'sd.dss@sf.';
      elemInput.dispatchEvent(new Event('input'));
      tick();
      fixture.detectChanges();
      emailErrMsg = fixture.nativeElement.querySelector('#error-email');
      expect(emailCtrl.valid).toBeFalsy();
      expect(emailErrMsg).toBeTruthy();
      expect(fixture.nativeElement.querySelector('#error-email')
        .textContent.trim()).toBe('You must enter a valid Email ID');
    }));

  }));

  it('should not display email validation error when the email field is valid', fakeAsync(() => {
    fixture.whenStable().then((() => {
      emailCtrl = component.loginForm.controls['email'];
      const elemInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
      elemInput.value = 'sd.dss@sf.in';
      elemInput.dispatchEvent(new Event('input'));
      tick();
      fixture.detectChanges();
      emailErrMsg = fixture.nativeElement.querySelector('#error-email');
      expect(fixture.nativeElement.querySelector('input[formControlName=email]')).toBeTruthy();
      expect(emailCtrl.valid).toBeTruthy();
      expect(emailErrMsg).toBeFalsy();
    }));
  }));

  it('should display no password validation error when the field kept as null(dirty)', fakeAsync(() => {

    fixture.whenStable().then((() => {
      passwordCtrl = component.loginForm.controls['password'];
      const elemInput: HTMLInputElement = fixture.nativeElement.querySelector('#password');
      elemInput.value = '';
      elemInput.dispatchEvent(new Event('input'));
      expect(component.loginForm.valid).toBeFalsy();
      tick();
      fixture.detectChanges();
      errorAlertNoPassword = fixture.nativeElement.querySelector('#error-no-password');
      expect(passwordCtrl.valid).toBeFalsy();
      expect(errorAlertNoPassword).toBeTruthy();
      expect(fixture.nativeElement.querySelector('#error-no-password').textContent.trim()).toBe('You must enter a password');
    }));

  }));

  it('should display minlength 8 password validation error when the password length less than 8', fakeAsync(() => {

    fixture.whenStable().then((() => {
      passwordCtrl = component.loginForm.controls['password'];
      const elemInput: HTMLInputElement = fixture.nativeElement.querySelector('#password');
      elemInput.value = 'xxx';
      elemInput.dispatchEvent(new Event('input'));
      tick();
      fixture.detectChanges();
      errorAlertMinlengthPassword = fixture.nativeElement.querySelector('#error-minlength-password');
      expect(passwordCtrl.valid).toBeFalsy();
      expect(errorAlertMinlengthPassword).toBeTruthy();
      expect(fixture.nativeElement.querySelector('#error-minlength-password')
        .textContent.trim()).toBe('Password must be at least 8 characters long');
    }));

  }));

  it('should display maxlength password validation error when the password length exceeds 20', fakeAsync(() => {

    fixture.whenStable().then((() => {
      passwordCtrl = component.loginForm.controls['password'];
      const elemInput: HTMLInputElement = fixture.nativeElement.querySelector('#password');
      elemInput.value = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
      elemInput.dispatchEvent(new Event('input'));
      tick();
      fixture.detectChanges();
      errorAlertMaxlengthPassword = fixture.nativeElement.querySelector('#error-maxlength-password');
      expect(passwordCtrl.valid).toBeFalsy();
      expect(errorAlertMaxlengthPassword).toBeTruthy();
      expect(fixture.nativeElement.querySelector('#error-maxlength-password')
        .textContent.trim()).toBe('Password cannot exceed 20 characters');
    }));

  }));

  it('should display password pattern validation error', fakeAsync(() => {

    fixture.whenStable().then((() => {
      passwordCtrl = component.loginForm.controls['password'];
      const elemInput: HTMLInputElement = fixture.nativeElement.querySelector('#password');
      elemInput.value = '@jkyukhcbncvn()';
      elemInput.dispatchEvent(new Event('input'));
      tick();
      fixture.detectChanges();
      errorAlertPatternPassword = fixture.nativeElement.querySelector('#error-pattern-password');
      expect(passwordCtrl.valid).toBeFalsy();
      expect(errorAlertPatternPassword).toBeTruthy();
      expect(fixture.nativeElement.querySelector('#error-pattern-password')
        .textContent.trim()).toBe('Pattern does not match');
    }));

  }));

  it('should not display password error when the password field is valid', fakeAsync(() => {
    fixture.whenStable().then((() => {
      passwordCtrl = component.loginForm.controls['password'];
      const elemInput: HTMLInputElement = fixture.nativeElement.querySelector('#password');
      elemInput.value = 'Xxxxxxxx1$';
      elemInput.dispatchEvent(new Event('input'));
      tick();
      fixture.detectChanges();
      errorAlertNoPassword = fixture.nativeElement.querySelector('#error-no-password');
      errorAlertMinlengthPassword = fixture.nativeElement.querySelector('#error-minlength-password');
      errorAlertMaxlengthPassword = fixture.nativeElement.querySelector('#error-maxlength-password');
      errorAlertPatternPassword = fixture.nativeElement.querySelector('#error-pattern-password');
      expect(fixture.nativeElement.querySelector('input[formControlName=password]')).toBeTruthy();
      expect(passwordCtrl.valid).toBeTruthy();
      expect(errorAlertNoPassword).toBeFalsy();
      expect(errorAlertMinlengthPassword).toBeFalsy();
      expect(errorAlertMaxlengthPassword).toBeFalsy();
      expect(errorAlertPatternPassword).toBeFalsy();
    }));
  }));

  it('should enable login button(form valid) when both field are valid', fakeAsync(() => {
    fixture.whenStable().then((() => {

      emailCtrl = component.loginForm.controls['email'];
      const elemInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
      elemInput.value = 'xxxxx@yyy.in';
      elemInput.dispatchEvent(new Event('input'));

      passwordCtrl = component.loginForm.controls['password'];
      const elemInput2: HTMLInputElement = fixture.nativeElement.querySelector('#password');
      elemInput2.value = 'Xxxxxxxx1$';
      elemInput2.dispatchEvent(new Event('input'));
      tick();
      fixture.detectChanges();
      emailErrMsg = fixture.nativeElement.querySelector('#error-email');
      errorAlertNoPassword = fixture.nativeElement.querySelector('#error-no-password');
      errorAlertMinlengthPassword = fixture.nativeElement.querySelector('#error-minlength-password');
      errorAlertMaxlengthPassword = fixture.nativeElement.querySelector('#error-maxlength-password');
      errorAlertPatternPassword = fixture.nativeElement.querySelector('#error-pattern-password');

      expect(emailCtrl.valid).toBeTruthy();
      expect(emailErrMsg).toBeFalsy();

      expect(fixture.nativeElement.querySelector('input[formControlName=password]')).toBeTruthy();
      expect(passwordCtrl.valid).toBeTruthy();
      expect(errorAlertNoPassword).toBeFalsy();
      expect(errorAlertMinlengthPassword).toBeFalsy();
      expect(errorAlertMaxlengthPassword).toBeFalsy();
      expect(errorAlertPatternPassword).toBeFalsy();
      expect(component.loginForm.valid).toBeTruthy();

    }));
  }));


  it('should hide validation messages and call login method from authservice for valid credentials', fakeAsync(() => {
    spyOn(component, 'doLogin').and.callThrough();
    spyOn(dataService, 'authenticateUser').and.callThrough();
    tick();
    const elemInput1: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    const elemInput2: HTMLInputElement = fixture.nativeElement.querySelector('#password');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      elemInput1.value = 'xxxxx@yyy.in';
      elemInput1.dispatchEvent(new Event('input'));
      elemInput2.value = 'Xxxxxxxx1$';
      elemInput2.dispatchEvent(new Event('input'));
      tick();
      fixture.detectChanges();
      expect(component.loginForm.valid).toBeTruthy();
      fixture.nativeElement.querySelector('#loginBtn').click();
      tick();
      fixture.detectChanges();
      tick();
      expect(component.doLogin).toHaveBeenCalled();
      expect(dataService.authenticateUser).toHaveBeenCalledWith('xxxxx@yyy.in', 'Xxxxxxxx1$');
    });
  }));

  it('should redirect to profile page on correct credentials', fakeAsync(() => {
    component.ngOnInit();
    spyOn(dataService, 'authenticateUser').and.returnValue(of(true));
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    spyOn(component, 'doLogin').and.callThrough();
    const elemInput1: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    const elemInput2: HTMLInputElement = fixture.nativeElement.querySelector('#password');
    tick();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      elemInput1.value = 'xxxxx@yyy.in';
      elemInput1.dispatchEvent(new Event('input'));
      elemInput2.value = 'Xxxxxxxx1$';
      elemInput2.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.nativeElement.querySelector('#loginBtn').click();
      fixture.detectChanges();
      expect(component.doLogin).toHaveBeenCalled();
      fixture.detectChanges();
      expect(dataService.authenticateUser).toHaveBeenCalledWith('xxxxx@yyy.in', 'Xxxxxxxx1$');
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(location.path()).toBe('/profile');
      });
    });
  }));

  it('should not redirect to other pages on incorrect credentials', fakeAsync(() => {
    component.ngOnInit();
    spyOn(dataService, 'authenticateUser').and.callThrough();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    spyOn(component, 'doLogin').and.callThrough();
    const elemInput1: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    const elemInput2: HTMLInputElement = fixture.nativeElement.querySelector('#password');
    tick();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      elemInput1.value = 'xxxxx@yyy.in';
      elemInput1.dispatchEvent(new Event('input'));
      elemInput2.value = 'Xxxxxxxx1$';
      elemInput2.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.nativeElement.querySelector('#loginBtn').click();
      fixture.detectChanges();
      expect(component.doLogin).toHaveBeenCalled();
      fixture.detectChanges();
      expect(dataService.authenticateUser).toHaveBeenCalledWith('xxxxx@yyy.in', 'Xxxxxxxx1$');
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(location.path()).toBe('');
      });
    });
  }));

  it('should not redirect to other pages on occurence of error', fakeAsync(() => {
    component.ngOnInit();
    spyOn(dataService, 'authenticateUser').and.returnValue(throwError(expectedErrorResponse));
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    spyOn(component, 'doLogin').and.callThrough();
    const elemInput1: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    const elemInput2: HTMLInputElement = fixture.nativeElement.querySelector('#password');
    tick();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      elemInput1.value = 'xxxxx@yyy.in';
      elemInput1.dispatchEvent(new Event('input'));
      elemInput2.value = 'Xxxxxxxx1$';
      elemInput2.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.loginForm.valid).toBeTruthy();
      fixture.nativeElement.querySelector('#loginBtn').click();
      fixture.detectChanges();
      expect(component.doLogin).toHaveBeenCalled();
      fixture.detectChanges();
      expect(dataService.authenticateUser).toHaveBeenCalledWith('xxxxx@yyy.in', 'Xxxxxxxx1$');
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(location.path()).toBe('');
      });
    });
  }));

  it('#dologin should return false if form is invalid', () => {
    component.doLogin();
    expect(component.loginForm.valid).toBeFalsy();
    spyOn(component, 'doLogin').and.callThrough();
    fixture.nativeElement.querySelector('#loginBtn').click();
    expect(component.doLogin).not.toHaveBeenCalled();
  });

  it('clear localStorage if any, when login', fakeAsync(() => {
    component.ngOnInit();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    localStorage.setItem('id','abc123efg');
      localStorage.setItem('token','abc123efg');
    const elemInput1: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    const elemInput2: HTMLInputElement = fixture.nativeElement.querySelector('#password');
    tick();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      elemInput1.value = 'xxxxx@yyy.in';
      elemInput1.dispatchEvent(new Event('input'));
      elemInput2.value = 'Xxxxxxxx1$';
      elemInput2.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.nativeElement.querySelector('#loginBtn').click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
          expect(localStorage.getItem('id')).toBeNull();
          expect(localStorage.getItem('token')).toBeNull();
      });
    });
  }));


  it('should navigate to register-new-user page when clicked on "sign up" button', fakeAsync(() => {
    const eleGuestUserButton = fixture.nativeElement.querySelector('#signupBtn');
    eleGuestUserButton.click();
    tick();
    fixture.detectChanges();
    expect(location.path()).toBe('/register_user');
  }));


});

