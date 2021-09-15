import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs';
// import * as alertify from 'alertify.js';
import { Users } from '../../models/users';

@Component({
  selector: 'app-register-new-user',
  templateUrl: './register-new-user.component.html',
  styleUrls: ['./register-new-user.component.css']
})

export class RegisterNewUserComponent implements OnInit {

	regNewUser = new Users;
	signupForm: FormGroup;

  emptyUserName = 'You must enter a username';
  minlengthUserName = 'User name must be at least 3 characters long';
  maxlengthUserName = 'Username cannot exceed 20 characters';
  userNamePattern = 'Username should be in alphanumeric only';

  emptyPassword = 'You must enter a password';
  minlengthPassword = 'Password must be at least 8 characters long';
  maxlengthPassword = 'Password cannot exceed 20 characters';
  passwordPattern = 'Pattern does not match';

  mobileErrMsg = 'You must enter a valid mobile number';
  emailErrMsg = 'You must enter a valid Email ID';
  locationErrMsg = 'You must enter the location';

  constructor(private route: Router, private dataService: DataService) {
   }

  ngOnInit() {

    // add necessary validators

  	this.signupForm = new FormGroup({
  		userName: new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(20),Validators.pattern("^[a-zA-Z0-9_]*$")]),
  		password: new FormControl('',[Validators.required,Validators.minLength(8),Validators.maxLength(20),Validators.pattern('(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>"\'\\;:\{\\\}\\\[\\\]\\\|\\\+\\\-\\\=\\\_\\\)\\\(\\\)\\\`\\\/\\\\\\]])[A-Za-z0-9\d$@].{7,}')]),
      mobile: new FormControl('',[Validators.required,Validators.pattern("^(0|[1-9][0-9]*){10,}$")]),
      email: new FormControl('',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      location: new FormControl('',[Validators.required])

      // userName: new FormControl('yyy12',[Validators.required,Validators.minLength(3),Validators.maxLength(20),Validators.pattern("^[a-zA-Z0-9_]*$")]),
  		// password: new FormControl('Xxxxxxxxx1$',[Validators.required,Validators.minLength(8),Validators.maxLength(20),Validators.pattern('(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>"\'\\;:\{\\\}\\\[\\\]\\\|\\\+\\\-\\\=\\\_\\\)\\\(\\\)\\\`\\\/\\\\\\]])[A-Za-z0-9\d$@].{7,}')]),
      // mobile: new FormControl('9900880044',[Validators.required,Validators.pattern("^(0|[1-9][0-9]*){10,}$")]),
      // email: new FormControl('xxx@yy.in',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      // location: new FormControl('zzzzz',[Validators.required])
  	});
  }

  signUp() {
    debugger;
    this.dataService.regNewUser(this.signupForm.value).subscribe(data =>{
      debugger;
      this.route.navigate(['/login']);
    },
    err =>{
      debugger;
      //this.route.navigate([]);
    })
    
    // call regNewUser method to perform signup operation
    // if success, redirect to login page
    // else display appropriate error message
       // reset the form
    
  }

  goBack() {
    debugger;
    this.route.navigate(['/login']);
    // should navigate to login page

  }


}
