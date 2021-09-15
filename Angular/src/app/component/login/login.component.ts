import { Component, OnInit,  Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/app/models/loginResponse';
import { ApiService } from '../../services/api.service';

import { DataService } from '../../services/data.service';
// import * as alertify from 'alertify.js';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	
	isLoggedIn: boolean = false;
	loginForm: FormGroup;
	isLoginFailed: boolean = false;

	emptyPassword = 'You must enter a password';
	minlengthPassword = 'Password must be at least 8 characters long';
	maxlengthPassword = 'Password cannot exceed 20 characters';
	passwordPattern = 'Pattern does not match';

    emailErrMsg = 'You must enter a valid Email ID';

	constructor(private route: Router, private dataService: DataService) {
	 }

	ngOnInit() {
		// add necessary validators

		// this.loginForm = new FormGroup({
		// 	email: new FormControl('xxx@yy.in',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
		// 	password: new FormControl('Xxxxxxxxx1$',[Validators.required,Validators.minLength(8),Validators.maxLength(20),Validators.pattern('(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>"\'\\;:\{\\\}\\\[\\\]\\\|\\\+\\\-\\\=\\\_\\\)\\\(\\\)\\\`\\\/\\\\\\]])[A-Za-z0-9\d$@].{7,}')])
		// });

		this.loginForm = new FormGroup({
			email: new FormControl('',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
			password: new FormControl('',[Validators.required,Validators.minLength(8),Validators.maxLength(20),Validators.pattern('(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>"\'\\;:\{\\\}\\\[\\\]\\\|\\\+\\\-\\\=\\\_\\\)\\\(\\\)\\\`\\\/\\\\\\]])[A-Za-z0-9\d$@].{7,}')])
		});
	}

	doLogin() {
		localStorage.removeItem('id')
		localStorage.removeItem('token');
		debugger;
		this.dataService.authenticateUser(this.loginForm.value.email,this.loginForm.value.password).subscribe(data =>{
			debugger;
			console.log(data);
			//localStorage.setItem('token',data)
			if(data){
				this.route.navigate(['/profile']);
			}
			else{
				//this.route.navigate(['//']);
			}
			
			
     },
     err=>{
       debugger;
       this.isLoginFailed=true;
	   //this.route.navigate(['']);
     })
		// call authenticateUser method to perform login operation
		// if success, redirect to profile page
		// else display appropriate error message
		   // reset the form
	}

	signUp() {
		this.route.url[('/register_user')]
		// should navigate to register new user page
	}

}



