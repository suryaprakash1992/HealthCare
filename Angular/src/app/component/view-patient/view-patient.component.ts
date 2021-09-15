import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Appointment } from '../../models/appointment';
// import * as alertify from 'alertify.js';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.css'],
  providers: [DatePipe]
})
export class ViewPatientComponent implements OnInit {

  patient;
  listOfDiseases;
  today;
  isBookAppointment: boolean = true;
  isFormEnabled: boolean = false;
  isScheduledAppointment: boolean = true;
  isTableEnabled: boolean = false;
  appointmentForm: FormGroup;
  appointmentDetails = new Appointment;
  bookedAppointmentResponse;
  ScheduledAppointmentResponse;

  constructor(fb: FormBuilder,private route: Router, private datePipe: DatePipe, private activatedRoute: ActivatedRoute, private dataService: DataService) {
    this.today = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');

    // add necessary validators

    this.appointmentForm = fb.group({
      'selectDisease' : [null],
      'tentativeDate' : [null],
      'priority' : [null]
    })
   }

  ngOnInit() {
    this.dataService.getParticularPatient(400).subscribe(data =>{
      this.patient=data;
      console.log(data);
    })

    // get selected patient id
    // get Particular Patient from service using patient id and assign response to patient property

  }

  bookAppointment() {
    // get diseases list from service

    // change isBookAppointment, isScheduledAppointment, isFormEnabled, isTableEnabled property values appropriately
    this.isBookAppointment=false;
    this.isFormEnabled=true;
    this.isTableEnabled=false;
    this.dataService.diseasesList().subscribe(data =>{
      console.log(data);
      this.listOfDiseases=data;
    })
    this.dataService.scheduleAppointment(this.appointmentForm.value).subscribe(data =>{

    })
  }

  scheduleAppointment() {
    this.route.navigate(['/requested_appointments']);

    // The below attributes to be added while booking appointment using service
    // patientId, disease, priority, tentativedate

    // if booked successfully should redirect to 'requested_appointments' page
    
  }

  scheduledAppointment() {
    this.isScheduledAppointment=false;
    this.isFormEnabled=false;
    this.isTableEnabled=true;
    this.dataService.getSinglePatientAppointments(this.patient.id)

    // change isBookAppointment, isScheduledAppointment, isFormEnabled, isTableEnabled property values appropriately

    // get particular patient appointments using getSinglePatientAppointments method of DataService 

  }

  cancelAppointment(appointmentId) {
    this.dataService.deleteAppointment(appointmentId).subscribe(data =>{
      console.log(data);
    })
    // delete selected appointment uing service

    // After deleting the appointment, get particular patient appointments

  }
  
}
