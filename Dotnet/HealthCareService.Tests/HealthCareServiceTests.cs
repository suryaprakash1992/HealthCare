using System;
using System.Net.Http;

using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using HealthCareService.Models;
using Newtonsoft.Json;
using Xunit;
using Newtonsoft.Json.Linq;
using Xunit.Abstractions;
using System.Collections.Generic;

namespace HealthCareService.Tests
{
    [TestCaseOrderer("HealthCareService.Tests.PriorityOrderer", "HealthCareService.Tests")]
    public class HealthCareServiceTests
    {

        // private readonly AppTestFixture _factory;
  private readonly ITestOutputHelper output;

 
    public HealthCareServiceTests(ITestOutputHelper output)
    {
     
       this.output=output;

     // _Client = _factory.CreateClient();
      
    }
        [Fact,TestPriority(1)]
        public async Task addUser()
        {
            var _Client = new HttpClient();
             _Client.BaseAddress = new Uri("http://localhost:5000");
             await _Client.GetAsync("/database");
              var user = new ApplicationUser{user_name="user",user_email="user@health.com",password="user@1",user_mobile=999999999,location="wall street"};
              var content = JsonConvert.SerializeObject(user);
       var stringContent = new StringContent(content,Encoding.UTF8,"application/json");
       var response =  await _Client.PostAsync("/register",stringContent);
       response.EnsureSuccessStatusCode(); 

        }
         [Fact,TestPriority(2)]
        public async Task addUser2()
        {
            var _Client = new HttpClient();
             _Client.BaseAddress = new Uri("http://localhost:5000");
           //  await _Client.GetAsync("/database");
              var user = new ApplicationUser{user_name="user2",user_email="user2@health.com",password="user@2",user_mobile=999999998,location="wall street"};
              var content = JsonConvert.SerializeObject(user);
       var stringContent = new StringContent(content,Encoding.UTF8,"application/json");
       var response =  await _Client.PostAsync("/register",stringContent);
       response.EnsureSuccessStatusCode(); 

        }
         [Fact,TestPriority(3)]
        public async Task login(){
              var _Client = new HttpClient();
             _Client.BaseAddress = new Uri("http://localhost:5000");
             var credentials = new ApplicationUser{user_email="user@health.com",password="user@1"};
        var content =JsonConvert.SerializeObject(credentials);
        var stringContent = new  StringContent(content,Encoding.UTF8,"application/json");
        var response = await _Client.PostAsync("/signin",stringContent);
        response.EnsureSuccessStatusCode();
        }
         [Fact,TestPriority(4)]
        public async Task addPatient(){
              var _Client = new HttpClient();
             _Client.BaseAddress = new Uri("http://localhost:5000");
             var credentials = new ApplicationUser{user_email="user@health.com",password="user@1"};
        var content =JsonConvert.SerializeObject(credentials);
        var stringContent = new  StringContent(content,Encoding.UTF8,"application/json");
        var response = await _Client.PostAsync("/signin",stringContent);
        response.EnsureSuccessStatusCode();
        var token1 = await response.Content.ReadAsStringAsync();
        JObject json = JObject.Parse(token1);
        string jwttoken = Convert.ToString(json.GetValue("token"));
        string id = Convert.ToString(json.GetValue("id"));
         var response1 =await _Client.GetAsync("viewprofile/"+id);
         
         Assert.Equal("Unauthorized",response1.StatusCode.ToString());
        // Console.WriteLine(response1.StatusCode);
         //response1.StatusCode.Equals(200);
        // response1.EnsureSuccessStatusCode();
        _Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",jwttoken);
        var response2 =await _Client.GetAsync("viewprofile/"+id);
        Assert.Equal("OK",response2.StatusCode.ToString());
        var responseString1 = await response2.Content.ReadAsStringAsync();
        var user = JsonConvert.DeserializeObject<ApplicationUser>(responseString1);
        Assert.Equal("user",user.user_name);
       // response2.StatusCode.Equals(500);
        response2.EnsureSuccessStatusCode();
        var Patient = new Patient{Id="patient1",patient_name="patient1",patient_email="patient1@health.com",patient_gender="male",patient_mobile=999999998};
        var content1 =JsonConvert.SerializeObject(Patient);
        var stringContent1 = new  StringContent(content1,Encoding.UTF8,"application/json");
          _Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer","hello");
        var response3 = await _Client.PostAsync("patients/register",stringContent1);
       
         Assert.Equal("Unauthorized",response3.StatusCode.ToString());
          _Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",jwttoken);
         var response4 = await _Client.PostAsync("patients/register",stringContent1);
        Assert.Equal("OK",response4.StatusCode.ToString());
        }
         [Fact,TestPriority(5)]
        public async Task addmorePatients(){
             var _Client = new HttpClient();
             _Client.BaseAddress = new Uri("http://localhost:5000");
             var credentials = new ApplicationUser{user_email="user@health.com",password="user@1"};
        var content =JsonConvert.SerializeObject(credentials);
        var stringContent = new  StringContent(content,Encoding.UTF8,"application/json");
        var response = await _Client.PostAsync("/signin",stringContent);
        response.EnsureSuccessStatusCode();
        var token1 = await response.Content.ReadAsStringAsync();
        JObject json = JObject.Parse(token1);
        string jwttoken = Convert.ToString(json.GetValue("token"));
                 var Patient = new Patient{Id="patient2",patient_name="patient2",patient_email="patient2@health.com",patient_gender="female",patient_mobile=999999998};
        var content1 =JsonConvert.SerializeObject(Patient);
        var stringContent1 = new  StringContent(content1,Encoding.UTF8,"application/json");
          _Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer","hello");
        var response3 = await _Client.PostAsync("patients/register",stringContent1);
       
         Assert.Equal("Unauthorized",response3.StatusCode.ToString());
          _Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",jwttoken);
         var response4 = await _Client.PostAsync("patients/register",stringContent1);
        Assert.Equal("OK",response4.StatusCode.ToString());
         jwttoken = Convert.ToString(json.GetValue("token"));
                 var Patient2 = new Patient{Id="patient3",patient_name="patient3",patient_email="patient3@health.com",patient_gender="female",patient_mobile=999999998};
        var content2 =JsonConvert.SerializeObject(Patient2);
        var stringContent2 = new  StringContent(content2,Encoding.UTF8,"application/json");
         var response5 = await _Client.PostAsync("patients/register",stringContent2);
        Assert.Equal("OK",response5.StatusCode.ToString());
        var response6 = await _Client.GetAsync("patients/list/");
        Assert.Equal("OK",response6.StatusCode.ToString());
        var responseString1 = await response6.Content.ReadAsStringAsync();
        var patients = JsonConvert.DeserializeObject<List<Patient>>(responseString1);
        Assert.Equal(3,patients.Count);
        var response7 = await _Client.GetAsync("patients/view/patient3");
        var responsestring = await response7.Content.ReadAsStringAsync();
        var patient = JsonConvert.DeserializeObject<Patient>(responsestring);
        Assert.Equal("patient3",patient.Id);
        Assert.Equal("patient3@health.com",patient.patient_email);
        Assert.Equal("patient3",patient.patient_name);
        var response8 = await _Client.DeleteAsync("patients/delete/patient3");
        response8.EnsureSuccessStatusCode();
         var response9 = await _Client.GetAsync("patients/list/");
        Assert.Equal("OK",response9.StatusCode.ToString());
        var responseString4 = await response9.Content.ReadAsStringAsync();
        var patients1 = JsonConvert.DeserializeObject<List<Patient>>(responseString4);
        Assert.Equal(2,patients1.Count);
        }
         [Fact,TestPriority(6)]
        public async Task appointment(){
             var _Client = new HttpClient();
             _Client.BaseAddress = new Uri("http://localhost:5000");
             var credentials = new ApplicationUser{user_email="user@health.com",password="user@1"};
        var content =JsonConvert.SerializeObject(credentials);
        var stringContent = new  StringContent(content,Encoding.UTF8,"application/json");
        var response = await _Client.PostAsync("/signin",stringContent);
        response.EnsureSuccessStatusCode();
         var token1 = await response.Content.ReadAsStringAsync();
        JObject json = JObject.Parse(token1);
        string jwttoken = Convert.ToString(json.GetValue("token"));
        _Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",jwttoken);
        var appintment1 = new Appointment{bookingId="appointment1",disease="flu",tentativeDate=new DateTime(2020,3,1),priority="2",patientId="patient3"};
        var content1 =JsonConvert.SerializeObject(appintment1);
        var stringContent1 = new  StringContent(content1,Encoding.UTF8,"application/json");
         var response1 = await _Client.PostAsync("appointment/register",stringContent1);
        Assert.Equal("OK",response1.StatusCode.ToString());
         var appintment2 = new Appointment{bookingId="appointment2",disease="fever",tentativeDate=new DateTime(2020,3,1),priority="2",patientId="patient3"};
        var content2 =JsonConvert.SerializeObject(appintment2);
        var stringContent2 = new  StringContent(content2,Encoding.UTF8,"application/json");
         var response2 = await _Client.PostAsync("appointment/register",stringContent2);
        Assert.Equal("OK",response2.StatusCode.ToString());
         var appintment3 = new Appointment{bookingId="appointment3",disease="flu",tentativeDate=new DateTime(2020,12,1),priority="2",patientId="patient1"};
        var content3 =JsonConvert.SerializeObject(appintment3);
        var stringContent3 = new  StringContent(content3,Encoding.UTF8,"application/json");
         var response3 = await _Client.PostAsync("appointment/register",stringContent3);
        Assert.Equal("OK",response3.StatusCode.ToString());
        _Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer","jwttoken");
        var response4 = await _Client.GetAsync("appointment/list/");
         Assert.Equal("Unauthorized",response4.StatusCode.ToString());
         _Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",jwttoken);
         var response5 = await _Client.GetAsync("appointment/list/");
         Assert.Equal("OK",response5.StatusCode.ToString());
         var responseString1 = await response5.Content.ReadAsStringAsync();
          var appointments = JsonConvert.DeserializeObject<List<Appointment>>(responseString1);
        Assert.Equal(3,appointments.Count);
         var response6 = await _Client.GetAsync("appointment/list/patient3");
         Assert.Equal("OK",response6.StatusCode.ToString());
         var responseString2 = await response6.Content.ReadAsStringAsync();
          var appointments2 = JsonConvert.DeserializeObject<List<Appointment>>(responseString2);
        Assert.Equal(2,appointments2.Count);




        }
    }
}
