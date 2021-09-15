using System;
using System.ComponentModel.DataAnnotations;

namespace HealthCareService.Models
{
    public class ApplicationUser
    {
        [Key]
        public string Id{get;set;}
        public string user_name{get;set;}
        public string user_email{get;set;}
        public string password{get;set;}
      //  public DateTime user_dob{get;set;}
        public long user_mobile{get;set;}
        public string location{get;set;}
    }
}