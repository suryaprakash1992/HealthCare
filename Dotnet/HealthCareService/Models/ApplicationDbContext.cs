using Microsoft.EntityFrameworkCore;

namespace HealthCareService.Models
{
    public class ApplicationDbContext : DbContext
    {
      
          
                public ApplicationDbContext (DbContextOptions<ApplicationDbContext> options) : base (options) {
                    
                 }
            protected override void OnModelCreating(ModelBuilder modelBuilder)
                {
                    base.OnModelCreating(modelBuilder);
                    //  modelBuilder.Entity<ApplicationUser>()
                    //    .HasKey(u => u.email);
                    modelBuilder.Entity<ApplicationUser>()
                    .Property(u=>u.Id)
                    .ValueGeneratedOnAdd();
                    modelBuilder.Entity<Patient>()
                    .Property(p=>p.Id)
                    .ValueGeneratedOnAdd();
                    modelBuilder.Entity<Appointment>()
                    .Property(p=>p.bookingId)
                    .ValueGeneratedOnAdd();
            //          modelBuilder.Entity<Appointment>()
            // .HasOne<Patient>(r => r.patient)
            // .HasForeignKey(r => r.pgid);
                }
                public DbSet<ApplicationUser> User { get; set; }
                public DbSet<Patient> Patients { get; set; }
                public DbSet<Appointment> Appointments { get; set; }

      
    }
    
}