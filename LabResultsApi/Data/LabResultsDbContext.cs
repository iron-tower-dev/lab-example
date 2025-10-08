using Microsoft.EntityFrameworkCore;
using LabResultsApi.Models;

namespace LabResultsApi.Data;

public class LabResultsDbContext : DbContext
{
    public LabResultsDbContext(DbContextOptions<LabResultsDbContext> options) : base(options)
    {
    }

    public DbSet<TestReading> TestReadings { get; set; }
    public DbSet<Test> Tests { get; set; }
    public DbSet<UsedLubeSample> UsedLubeSamples { get; set; }
    public DbSet<ParticleType> ParticleTypes { get; set; }
    public DbSet<ParticleSubType> ParticleSubTypes { get; set; }
    public DbSet<ParticleTypeDefinition> ParticleTypeDefinitions { get; set; }
    public DbSet<ParticleSubTypeDefinition> ParticleSubTypeDefinitions { get; set; }
    public DbSet<ParticleSubTypeCategoryDefinition> ParticleSubTypeCategoryDefinitions { get; set; }
    public DbSet<FTIR> FTIRs { get; set; }
    public DbSet<EmSpectro> EmSpectros { get; set; }
    public DbSet<ParticleCount> ParticleCounts { get; set; }
    public DbSet<MAndTEquip> MAndTEquips { get; set; }
    public DbSet<LubeTechQualification> LubeTechQualifications { get; set; }
    public DbSet<Component> Components { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<Lubricant> Lubricants { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<TestStand> TestStands { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure TestReading entity
        modelBuilder.Entity<TestReading>(entity =>
        {
            entity.HasKey(e => new { e.SampleId, e.TestId, e.TrialNumber });
            entity.Property(e => e.Status).HasMaxLength(1);
            entity.Property(e => e.SchedType).HasMaxLength(10);
            entity.Property(e => e.EntryId).HasMaxLength(5);
            entity.Property(e => e.ValidateId).HasMaxLength(5);
            entity.Property(e => e.Id1).HasMaxLength(30);
            entity.Property(e => e.Id2).HasMaxLength(30);
            entity.Property(e => e.Id3).HasMaxLength(30);
            entity.Property(e => e.MainComments).HasMaxLength(1000);
        });

        // Configure Test entity - No primary key in database
        modelBuilder.Entity<Test>(entity =>
        {
            entity.HasNoKey();
            entity.ToTable("Test");
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Name).HasMaxLength(40).HasColumnName("name");
            entity.Property(e => e.TestStandId).HasColumnName("testStandID");
            entity.Property(e => e.SampleVolumeRequired).HasColumnName("sampleVolumeRequired");
            entity.Property(e => e.Exclude).HasMaxLength(1).HasColumnName("exclude");
            entity.Property(e => e.Abbrev).HasMaxLength(12).HasColumnName("abbrev");
            entity.Property(e => e.DisplayGroupId).HasColumnName("displayGroupId");
            entity.Property(e => e.GroupName).HasMaxLength(30).HasColumnName("groupname");
            entity.Property(e => e.Lab).HasColumnName("Lab");
            entity.Property(e => e.Schedule).HasColumnName("Schedule");
            entity.Property(e => e.ShortAbbrev).HasMaxLength(6).HasColumnName("ShortAbbrev");
        });

        // Configure UsedLubeSample entity
        modelBuilder.Entity<UsedLubeSample>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TagNumber).HasMaxLength(22);
            entity.Property(e => e.Component).HasMaxLength(3);
            entity.Property(e => e.Location).HasMaxLength(3);
            entity.Property(e => e.LubeType).HasMaxLength(30);
            entity.Property(e => e.WoNumber).HasMaxLength(16);
            entity.Property(e => e.TrackingNumber).HasMaxLength(12);
            entity.Property(e => e.WarehouseId).HasMaxLength(10);
            entity.Property(e => e.BatchNumber).HasMaxLength(30);
            entity.Property(e => e.ClassItem).HasMaxLength(10);
            entity.Property(e => e.SampledBy).HasMaxLength(50);
            entity.Property(e => e.EntryId).HasMaxLength(5);
            entity.Property(e => e.ValidateId).HasMaxLength(5);
            entity.Property(e => e.ResultsReviewId).HasMaxLength(5);
            entity.Property(e => e.StoreSource).HasMaxLength(100);
            entity.Property(e => e.Schedule).HasMaxLength(1);
        });

        // Configure ParticleType entity - No primary key in database
        modelBuilder.Entity<ParticleType>(entity =>
        {
            entity.HasNoKey();
            entity.ToTable("ParticleType");
            entity.Property(e => e.SampleId).HasColumnName("SampleID");
            entity.Property(e => e.TestId).HasColumnName("testID");
            entity.Property(e => e.ParticleTypeDefinitionId).HasColumnName("ParticleTypeDefinitionID");
            entity.Property(e => e.Status).HasMaxLength(20).HasColumnName("Status");
            entity.Property(e => e.Comments).HasMaxLength(500).HasColumnName("Comments");
        });

        // Configure ParticleSubType entity - No primary key in database
        modelBuilder.Entity<ParticleSubType>(entity =>
        {
            entity.HasNoKey();
            entity.ToTable("ParticleSubType");
            entity.Property(e => e.SampleId).HasColumnName("SampleID");
            entity.Property(e => e.TestId).HasColumnName("testID");
            entity.Property(e => e.ParticleTypeDefinitionId).HasColumnName("ParticleTypeDefinitionID");
            entity.Property(e => e.ParticleSubTypeCategoryId).HasColumnName("ParticleSubTypeCategoryID");
            entity.Property(e => e.Value).HasColumnName("Value");
        });

        // Configure FTIR entity
        modelBuilder.Entity<FTIR>(entity =>
        {
            entity.HasKey(e => e.SampleId);
        });

        // Configure EmSpectro entity
        modelBuilder.Entity<EmSpectro>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.TestId, e.TrialNum });
        });

        // Configure ParticleCount entity
        modelBuilder.Entity<ParticleCount>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.IsoCode).HasMaxLength(5);
            entity.Property(e => e.NasClass).HasMaxLength(2);
        });

        // Configure MAndTEquip entity
        modelBuilder.Entity<MAndTEquip>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.ToTable("M_And_T_Equip");
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.EquipType).HasMaxLength(30).HasColumnName("EquipType");
            entity.Property(e => e.EquipName).HasMaxLength(30).HasColumnName("EquipName");
            entity.Property(e => e.Exclude).HasColumnName("exclude");
            entity.Property(e => e.TestId).HasColumnName("testID");
            entity.Property(e => e.DueDate).HasColumnName("DueDate");
            entity.Property(e => e.Comments).HasMaxLength(250).HasColumnName("Comments");
            entity.Property(e => e.Val1).HasColumnName("Val1");
            entity.Property(e => e.Val2).HasColumnName("Val2");
            entity.Property(e => e.Val3).HasColumnName("Val3");
            entity.Property(e => e.Val4).HasColumnName("Val4");
        });

        // Configure LubeTechQualification entity - No primary key in database
        modelBuilder.Entity<LubeTechQualification>(entity =>
        {
            entity.HasNoKey();
            entity.ToTable("LubeTechQualification");
            entity.Property(e => e.EmployeeId).HasMaxLength(5).HasColumnName("employeeID");
            entity.Property(e => e.TestStandId).HasColumnName("testStandID");
            entity.Property(e => e.TestStand).HasMaxLength(50).HasColumnName("testStand");
            entity.Property(e => e.QualificationLevel).HasMaxLength(10).HasColumnName("qualificationLevel");
        });

        // Configure Component entity
        modelBuilder.Entity<Component>(entity =>
        {
            entity.HasKey(e => e.Code);
            entity.Property(e => e.Code).HasMaxLength(3);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        // Configure Location entity
        modelBuilder.Entity<Location>(entity =>
        {
            entity.HasKey(e => e.Code);
            entity.Property(e => e.Code).HasMaxLength(3);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        // Configure Lubricant entity
        modelBuilder.Entity<Lubricant>(entity =>
        {
            entity.HasKey(e => e.Type);
            entity.Property(e => e.Type).HasMaxLength(30);
        });

        // Configure Comment entity
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Area).HasMaxLength(20);
            entity.Property(e => e.Remark).HasMaxLength(500);
        });

        // Configure TestStand entity
        modelBuilder.Entity<TestStand>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.ToTable("TestStand");
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Name).HasMaxLength(50).HasColumnName("name");
        });
    }
}
