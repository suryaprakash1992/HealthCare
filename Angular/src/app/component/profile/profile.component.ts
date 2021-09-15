import { Component, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Users } from '../../models/users';
import { DataService } from '../../services/data.service';
// import * as alertify from 'alertify.js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  // used as a flag to display or hide form
  editProfile = false;
  userDetails = new Users;
  updateMyDetails : any = {};
  editProfileForm: FormGroup;
  userImg = './../../assets/user.jpg';
  mobileErrMsg = 'You must enter a valid mobile number';
  emailErrMsg = 'You must enter a valid Email ID';
  locationErrMsg = 'You must enter the location';
  constructor(private dataService: DataService) { 

  }

  ngOnInit() {

    // add necessary validators
    // username should be disabled. it should not be edited
   
    this.editProfileForm = new FormGroup({
      userName: new FormControl(''),
      mobile: new FormControl('',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]),
      email: new FormControl('',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      location: new FormControl('',[Validators.required])
    });
    this.getProfileDetails();
    // get profile details and display it
    
  }

  getProfileDetails() {

    // retrieve user details from service using userId
    this.dataService.getUserDetails().subscribe(userData=>{
      debugger;
      // this.userDetails.user_email=userData[0].email?undefined:userData.user_email;
      // this.userDetails.location=userData[0].location;
      // this.userDetails.user_mobile=userData[0].mobile?undefined:userData.user_mobile;
      // this.userDetails.user_name=userData[0].userName?undefined:userData.user_name;
      this.userDetails.user_email=userData.user_email;
      this.userDetails.location=userData.location;
      this.userDetails.user_mobile=userData.user_mobile;
      this.userDetails.user_name=userData.user_name;
      let userDetail ={
        // userName : userData[0].userName?undefined:userData.user_name,
        // mobile : userData[0].mobile?undefined:userData.user_mobile,
        // email : userData[0].email?undefined:userData.user_email,
        // location : userData[0].location

        userName : userData.user_name,
        mobile : userData.user_mobile,
        email : userData.user_email,
        location : userData.location
      }
      this.editProfileForm.setValue(userDetail);
      debugger;
    },
    err =>{
      debugger;
      let userDetail ={
        userName : '',
        mobile : '',
        email : '',
        location : ''
      }
      this.editProfileForm.setValue(userDetail);
    })

  }

  changeMyProfile() {

    // if successfully changed the profile it should display new details hiding the form
    let userId = localStorage.getItem('id');
    this.dataService.updateProfile(userId,this.editProfileForm.value).subscribe(data=>{
      if(data){
        this.getProfileDetails();
      }
      
      console.log(data)
     this.discardEdit();
      //this.editProfile=false;
    // this.editButton=true;
    },
    err=>{

    })
  }

  editMyProfile() {
    this.editProfile=true;
    this.getProfileDetails();
    

    // change editProfile property value appropriately

  }

  discardEdit() {
    //this.editProfileForm.reset();
    debugger;
    this.editProfile=false;
    debugger;

    // change editProfile property value appropriately

  }

}
