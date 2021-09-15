using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareService.Models
{
   public class Appointment
    {
         [Key]
        public string bookingId{get;set;}
        [Required]
        public string disease{get;set;}
        [Required]
        public DateTime tentativeDate{get;set;}
        [Required]
        public string priority{get;set;}
        [Required]
        public DateTime bookingTime{get;set;}
        // [Required]
        // public string timings{get;set;}
        // [Required]
        // public string description{get;set;}
        [Required]
        public string patientId{get;set;}

       
    }
}