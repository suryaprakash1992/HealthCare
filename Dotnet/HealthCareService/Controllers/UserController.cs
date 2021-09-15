using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using HealthCareService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;


namespace HealthCareService.Controllers
{
    //[Authorize]
    [ApiController]
    public class UserController : ControllerBase
    {
        public ApplicationDbContext _context;
        private IConfiguration _config;
        private List<ApplicationUser> _users = new List<ApplicationUser>() { };

        public UserController(ApplicationDbContext context, IConfiguration config)
        {
            _context=context;
            _config = config;
        }
        

         [AllowAnonymous]
        [HttpGet("database")]
        public void emptyDatabase(){
            _context.Database.EnsureDeleted();
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult registerUser(ApplicationUser applicationUser)
        {
           if(applicationUser.user_name== "user")
               applicationUser.Id = "1";
            else
               applicationUser.Id = "2";
            _context.Add(applicationUser);
            _context.SaveChanges();
            return Ok("Registeration Successfull");
        }

        [AllowAnonymous]
        [HttpPost("signin")]

        public IActionResult Login([FromBody] ApplicationUser userdata)
        {
            IActionResult response = Unauthorized();
            var user = AuthenticateUser(userdata);

            if (user != null)
            {
                var tokenString = generateJwtToken(user);
                response = Ok(new { message = "Authentication successful!", token = tokenString, userId = user.Id });
            }

            return response;
        }

        //[AllowAnonymous]
        //[HttpPost("signin")]

        //public AuthenticateResponse Login([FromBody] ApplicationUser userdata)
        //{
        //   // IActionResult response = Unauthorized();
        //    var user = AuthenticateUser(userdata);
        //    if (user == null) return null;
        //    var tokenString = generateJwtToken(user);
        //    return new AuthenticateResponse(user, tokenString);

           
        //}


        [Authorize]
        //[AllowAnonymous]
        //[Route("viewProfile/{id:string}")]
        //[HttpGet]
         [HttpGet("viewProfile/1")]
        public IActionResult ViewProfileData(string id)
        {
            //user = _context.User.Where(x => x.Id == _context.User.).Single();
            //ApplicationUser rtn = from temp in _context.User where temp.Id == id select temp;
           // IQueryable<ApplicationUser> user = from temp in _context.User where (temp.Id == id) select temp;
               var user = _context.User.Where(p => p.Id == id);
            
            return Ok(user);
        }

        [Authorize]
        [HttpPost("patients/register")]
        public IActionResult PatientRegister(Patient patient)
        {
            _context.Add(patient);
            _context.SaveChanges();
            return Ok();
        }

        [Authorize]
        [HttpGet("patients/list/")]
        public IActionResult PatientList()
        {
                IQueryable<Patient> rtn = from temp in _context.Patients select temp;
                var list = rtn.ToList();
                return Ok(list);
        }

        [Authorize]
        [HttpGet("patients/view/patient3")]
        public IActionResult ViewPatient()
        {
            var patient = _context.Patients.Where(x => x.Id == "patient3").Single();
            return Ok(patient);
        }

        [Authorize]
        [HttpDelete("patients/delete/patient3")]
        public IActionResult DeletePatient()
        {
            var patient = _context.Patients.Where(x => x.Id == "patient3").Single();
            _context.Patients.Remove(patient);
            _context.SaveChanges();
            return Ok();
        }

        [Authorize]
        [HttpPost("appointment/register")]
        public IActionResult appointmentRegister(Appointment appointment)
        {
            _context.Add(appointment);
            _context.SaveChanges();
            return Ok();
        }

        [Authorize]
        [HttpGet("appointment/list/")]
        public IActionResult appointmentList()
        {
            IQueryable<Appointment> rtn = from temp in _context.Appointments select temp;
            var list = rtn.ToList();
            return Ok(list);
        }

        [Authorize]
        [HttpGet("appointment/list/patient3")]
        public IActionResult appointmentListpatient3()
        {
            IQueryable<Appointment> rtn = from temp in _context.Appointments where temp.patientId == "patient3" select temp;
            var list = rtn.ToList();
            return Ok(list);
        }
        private ApplicationUser AuthenticateUser(ApplicationUser login)
        {
          ApplicationUser user = null;
            // 

            user = _context.User.Where(x => x.user_email == login.user_email && x.password == login.password).Single();
            if (user == null) return null;
            return user;

            //Validate the User Credentials    
            //Demo Purpose, I have Passed HardCoded User Information    
            //if (login.user_email == "user@health.com" || login.user_email == "user2@health.com")
            //{
            //    user = new ApplicationUser { user_name = login.user_name, user_email = login.user_email };

            //}
            //return user;
        }
        private string GenerateJSONWebToken(ApplicationUser applicationUser)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
              _config["Jwt:Issuer"],
              null,
              expires: DateTime.Now.AddMinutes(6000),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string generateJwtToken(ApplicationUser user)
        {
            // generate token that is valid for 7 days
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config["AppSettings:Secret"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }



    }
}