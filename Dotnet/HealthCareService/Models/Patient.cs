using System;

namespace HealthCareService.Models
{
   public class Patient
    {
        public string Id{get;set;}
        public string patient_name{get;set;}
        public string patient_email{get;set;}
        public string patient_gender{get;set;}
       // public string password{get;set;}
        public string patient_dob{get;set;}
        public DateTime registeredDate{get;set;}
        public long patient_mobile{get;set;}
        // public string location{get;set;}
    }
}