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

        // Configure Test entity
        modelBuilder.Entity<Test>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(40);
            entity.Property(e => e.Exclude).HasMaxLength(1);
            entity.Property(e => e.Abbrev).HasMaxLength(12);
            entity.Property(e => e.GroupName).HasMaxLength(30);
            entity.Property(e => e.ShortAbbrev).HasMaxLength(6);
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

        // Configure ParticleType entity
        modelBuilder.Entity<ParticleType>(entity =>
        {
            entity.HasKey(e => new { e.SampleId, e.TestId, e.ParticleTypeDefinitionId });
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.Comments).HasMaxLength(500);
        });

        // Configure ParticleSubType entity
        modelBuilder.Entity<ParticleSubType>(entity =>
        {
            entity.HasKey(e => new { e.SampleId, e.TestId, e.ParticleTypeDefinitionId, e.ParticleSubTypeCategoryId });
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
            entity.HasKey(e => e.EquipName);
            entity.Property(e => e.EquipName).HasMaxLength(50);
            entity.Property(e => e.EquipType).HasMaxLength(20);
            entity.Property(e => e.Val1).HasMaxLength(50);
            entity.Property(e => e.Val2).HasMaxLength(50);
        });

        // Configure LubeTechQualification entity
        modelBuilder.Entity<LubeTechQualification>(entity =>
        {
            entity.HasKey(e => new { e.EmployeeId, e.TestStandId });
            entity.Property(e => e.EmployeeId).HasMaxLength(5);
            entity.Property(e => e.QualificationLevel).HasMaxLength(10);
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
    }
}
