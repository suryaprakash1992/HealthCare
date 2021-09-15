import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
// import * as alertify from 'alertify.js';

@Component({
  selector: 'app-all-requested-appointments',
  templateUrl: './all-requested-appointments.component.html',
  styleUrls: ['./all-requested-appointments.component.css']
})
export class AllRequestedAppointmentsComponent implements OnInit {

	allAppointments;

  constructor(private dataService: DataService, private route: Router) { 
  }

  ngOnInit() {
    // call appointments method by default
    this.appointments();
  }

  appointments() {
    this.dataService.requestedAppointments().subscribe(data =>{
      debugger;
      this.allAppointments=data;
      console.log(data);
    })

    // get all requested appointments from service

  }

  view(patientId) {
    this.route.navigate(['/patientList/'+patientId])
    // should navigate to 'patientList' page with selected patientId

  }

  cancelAppointment(id) {
    this.dataService.deleteAppointment(id).subscribe(data =>{
      console.log(data);
    })

    // delete selected appointment uing service

    // After deleting the appointment, get all requested appointments


  }

}
