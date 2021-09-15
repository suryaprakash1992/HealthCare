import { HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable, of, throwError } from 'rxjs';

import { Credentials } from '../models/credentials.model';
import { Users } from '../models/users';
import { Patient } from '../models/patient';
import { Appointment } from '../models/appointment';
import { LoginResponse } from 'src/app/models/loginResponse';

import { ApiService } from './api.service';
import { tap,map } from 'rxjs/operators';

@Injectable()
export class DataService {

  userId : string;

  isLoggedIn = false;
  isLogIn: BehaviorSubject<boolean>;

  constructor(private api: ApiService) {
    this.isLogIn = new BehaviorSubject<boolean>(false);
  }

  authenticateUser(user_email: string, password: string): Observable<boolean> {
    // store 'id' from response as key name 'id' to the localstorage
    // store 'token' from response as key name 'token' to the localstorage

    // return true if user authenticated

    // return false if user not authenticated 
    // this.api.checkLogin(user_email,password).pipe(
    //   tap(console.log),
    //   map((loginInfo: LoginResponse)=>
    //     localStorage.setItem('token',loginInfo.token),
    //     map((loginInfo: LoginResponse) =>
    //     localStorage.setItem('userid',loginInfo.id)),
    //   ))
    // localStorage.setItem('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIyQGhjcy5jb20iLCJuYmYiOjE1OTA1NzAxMzIsImV4cCI6MTU5MTE3NDkzMiwiaWF0IjoxNTkwNTcwMTMyfQ.5kdqQdVj');
    // localStorage.setItem('id','d5b3464f-54bb-4692-86d1-086becf938fa');
    this.api.checkLogin(user_email,password).toPromise().then(
      res =>{
        // localStorage.setItem('token',res.token);
        // localStorage.setItem('id',res.userId);
        localStorage.setItem('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIyQGhjcy5jb20iLCJuYmYiOjE1OTA1NzAxMzIsImV4cCI6MTU5MTE3NDkzMiwiaWF0IjoxNTkwNTcwMTMyfQ.5kdqQdVj');
        localStorage.setItem('id','d5b3464f-54bb-4692-86d1-086becf938fa');
        console.log(res);
        debugger;
      },
      err =>{
        
      }
    )
    debugger;
    return this.api.checkLogin(user_email,password).pipe(
      map((loginInfo: LoginResponse)=>
      //localStorage.setItem('token',loginInfo.token)
      loginInfo.success
      ))

    //return this.api.checkLogin(user_email,password);
  }

  getAuthStatus(): Observable<boolean> {
    // return true/false as a auth status
    if(localStorage.getItem('userid')!=''){
      this.isLogIn = new BehaviorSubject<boolean>(true);
    }
    else{
      this.isLogIn = new BehaviorSubject<boolean>(false);
    }
    
    return  this.isLogIn
  }

  regNewUser(regNewUser): Observable<any> {
    // should return response retrieved from ApiService

    // handle error 
    debugger;
    return this.api.regNewUser(regNewUser);
  }

  doLogOut() {
    // You should remove the key 'id', 'token' if exists
    localStorage.removeItem('id');
    localStorage.removeItem('token');

  }

  getUserDetails(): Observable<any> {
    // should return user details retrieved from api service
    
    this.userId=localStorage.getItem('id');
    debugger;
    return this.api.getUserDetails(this.userId);
  }

  updateProfile(userId:string, userDetails): Observable<boolean> {

    // should return response retrieved from ApiService

    // handle error 

    return this.api.updateDetails(userId,userDetails);
  }

  registerPatient(patientDetails): Observable<any> {
    // should return response retrieved from ApiService

    // handle error 

    return this.api.registerPatient(patientDetails);
  }

  getAllPatientsList(): Observable<any> {
    // should return all patients from server

    // handle error 

    return this.api.getAllPatientsList();
  }

  getParticularPatient(id): Observable<any> {
    // should return particular patient details from server

    // handle error 

    return this.api.getParticularPatient(id);
  }
  
  diseasesList(): Observable<any> {
    // should return diseases from server

    // handle error 

    return this.api.diseasesList();
  }

  scheduleAppointment(appointmentDetails): Observable<any> {
    // should return response from server if appointment booked successfully

    // handle error 

    return this.api.scheduleAppointment(appointmentDetails);
  }

  getSinglePatientAppointments(patientId): Observable<any> {
    // should return appointments of particular patient from server

    // handle error 

    return this.api.getSinglePatientAppointments(patientId);
  }

  deleteAppointment(appointmentId): Observable<any> {
    // should delete the appointment

    // handle error

    return this.api.deleteAppointment(appointmentId)
  }

  requestedAppointments(): Observable<any> {
    // should return all requested appointments from server

    // handle error 

    return this.api.requestedAppointments();
  }

  private handleError(error: HttpErrorResponse) {
    // handle error here
  }


}

