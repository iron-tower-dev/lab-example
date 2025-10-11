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

        // Configure TestReading entity - No primary key in database, use composite for tracking
        modelBuilder.Entity<TestReading>(entity =>
        {
            entity.HasNoKey();
            entity.ToTable("TestReadings");
            entity.Property(e => e.SampleId).HasColumnName("sampleID");
            entity.Property(e => e.TestId).HasColumnName("testID");
            entity.Property(e => e.TrialNumber).HasColumnName("trialNumber");
            entity.Property(e => e.Value1).HasColumnName("value1");
            entity.Property(e => e.Value2).HasColumnName("value2");
            entity.Property(e => e.Value3).HasColumnName("value3");
            entity.Property(e => e.TrialCalc).HasColumnName("trialCalc");
            entity.Property(e => e.Id1).HasMaxLength(30).HasColumnName("ID1");
            entity.Property(e => e.Id2).HasMaxLength(30).HasColumnName("ID2");
            entity.Property(e => e.Id3).HasMaxLength(30).HasColumnName("ID3");
            entity.Property(e => e.TrialComplete).HasColumnName("trialComplete");
            entity.Property(e => e.Status).HasMaxLength(1).HasColumnName("status");
            entity.Property(e => e.SchedType).HasMaxLength(10).HasColumnName("schedType");
            entity.Property(e => e.EntryId).HasMaxLength(5).HasColumnName("entryID");
            entity.Property(e => e.ValidateId).HasMaxLength(5).HasColumnName("validateID");
            entity.Property(e => e.EntryDate).HasColumnName("entryDate");
            entity.Property(e => e.ValiDate).HasColumnName("valiDate");
            entity.Property(e => e.MainComments).HasMaxLength(1000).HasColumnName("MainComments");
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

        // Configure UsedLubeSample entity - No primary key in database
        modelBuilder.Entity<UsedLubeSample>(entity =>
        {
            entity.HasNoKey();
            entity.ToTable("UsedLubeSamples");
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.TagNumber).HasMaxLength(22).HasColumnName("tagNumber");
            entity.Property(e => e.Component).HasMaxLength(3).HasColumnName("component");
            entity.Property(e => e.Location).HasMaxLength(3).HasColumnName("location");
            entity.Property(e => e.LubeType).HasMaxLength(30).HasColumnName("lubeType");
            entity.Property(e => e.WoNumber).HasMaxLength(16).HasColumnName("woNumber");
            entity.Property(e => e.TrackingNumber).HasMaxLength(12).HasColumnName("trackingNumber");
            entity.Property(e => e.WarehouseId).HasMaxLength(10).HasColumnName("warehouseId");
            entity.Property(e => e.BatchNumber).HasMaxLength(30).HasColumnName("batchNumber");
            entity.Property(e => e.ClassItem).HasMaxLength(10).HasColumnName("classItem");
            entity.Property(e => e.SampleDate).HasColumnName("sampleDate");
            entity.Property(e => e.ReceivedOn).HasColumnName("receivedOn");
            entity.Property(e => e.SampledBy).HasMaxLength(50).HasColumnName("sampledBy");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.CmptSelectFlag).HasColumnName("cmptSelectFlag");
            entity.Property(e => e.NewUsedFlag).HasColumnName("newUsedFlag");
            entity.Property(e => e.EntryId).HasMaxLength(5).HasColumnName("entryId");
            entity.Property(e => e.ValidateId).HasMaxLength(5).HasColumnName("validateId");
            entity.Property(e => e.TestPricesId).HasColumnName("testPricesId");
            entity.Property(e => e.PricingPackageId).HasColumnName("pricingPackageId");
            entity.Property(e => e.Evaluation).HasColumnName("evaluation");
            entity.Property(e => e.SiteId).HasColumnName("siteId");
            entity.Property(e => e.ResultsReviewDate).HasColumnName("results_review_date");
            entity.Property(e => e.ResultsAvailDate).HasColumnName("results_avail_date");
            entity.Property(e => e.ResultsReviewId).HasMaxLength(5).HasColumnName("results_reviewId");
            entity.Property(e => e.StoreSource).HasMaxLength(100).HasColumnName("storeSource");
            entity.Property(e => e.Schedule).HasMaxLength(1).HasColumnName("schedule");
            entity.Property(e => e.ReturnedDate).HasColumnName("returnedDate");
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

        // Configure FTIR entity - No primary key in database
        modelBuilder.Entity<FTIR>(entity =>
        {
            entity.HasNoKey();
            entity.ToTable("FTIR");
            entity.Property(e => e.SampleId).HasColumnName("sampleID");
            entity.Property(e => e.AntiOxidant).HasColumnName("anti_oxidant");
            entity.Property(e => e.Oxidation).HasColumnName("oxidation");
            entity.Property(e => e.H2O).HasColumnName("H2O");
            entity.Property(e => e.Zddp).HasColumnName("zddp");
            entity.Property(e => e.Soot).HasColumnName("soot");
            entity.Property(e => e.FuelDilution).HasColumnName("fuel_dilution");
            entity.Property(e => e.Mixture).HasColumnName("mixture");
            entity.Property(e => e.NLGI).HasColumnName("NLGI");
            entity.Property(e => e.Contam).HasColumnName("contam");
        });

        // Configure EmSpectro entity - No primary key in database
        modelBuilder.Entity<EmSpectro>(entity =>
        {
            entity.HasNoKey();
            entity.ToTable("EmSpectro");
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.TestId).HasColumnName("testID");
            entity.Property(e => e.TrialNum).HasColumnName("trialNum");
            entity.Property(e => e.TrialDate).HasColumnName("trialDate");
        });

        // Configure ParticleCount entity - No primary key in database
        modelBuilder.Entity<ParticleCount>(entity =>
        {
            entity.HasNoKey();
            entity.ToTable("ParticleCount");
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Micron5_10).HasColumnName("micron_5_10");
            entity.Property(e => e.Micron10_15).HasColumnName("micron_10_15");
            entity.Property(e => e.Micron15_25).HasColumnName("micron_15_25");
            entity.Property(e => e.Micron25_50).HasColumnName("micron_25_50");
            entity.Property(e => e.Micron50_100).HasColumnName("micron_50_100");
            entity.Property(e => e.Micron100).HasColumnName("micron_100");
            entity.Property(e => e.TestDate).HasColumnName("testDate");
            entity.Property(e => e.IsoCode).HasMaxLength(5).HasColumnName("iso_code");
            entity.Property(e => e.NasClass).HasMaxLength(2).HasColumnName("nas_class");
        });

        // Configure MAndTEquip entity - No primary key in database
        modelBuilder.Entity<MAndTEquip>(entity =>
        {
            entity.HasNoKey();
            entity.ToTable("M_And_T_Equip");
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.EquipType).HasMaxLength(30).IsRequired().HasColumnName("EquipType");
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

        // Configure ParticleTypeDefinition entity - Has primary key (ID)
        modelBuilder.Entity<ParticleTypeDefinition>(entity =>
        {
            entity.HasNoKey(); // No PK defined in database
            entity.ToTable("ParticleTypeDefinition");
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Type).HasMaxLength(50).IsRequired().HasColumnName("Type");
            entity.Property(e => e.Description).HasMaxLength(500).IsRequired().HasColumnName("Description");
            entity.Property(e => e.Image1).HasMaxLength(50).IsRequired().HasColumnName("Image1");
            entity.Property(e => e.Image2).HasMaxLength(50).IsRequired().HasColumnName("Image2");
            entity.Property(e => e.Active).HasMaxLength(1).HasColumnName("Active");
            entity.Property(e => e.SortOrder).HasColumnName("SortOrder");
        });

        // Configure ParticleSubTypeDefinition entity - Has composite primary key
        modelBuilder.Entity<ParticleSubTypeDefinition>(entity =>
        {
            entity.HasKey(e => new { e.ParticleSubTypeCategoryId, e.Value });
            entity.ToTable("ParticleSubTypeDefinition");
            entity.Property(e => e.ParticleSubTypeCategoryId).HasColumnName("ParticleSubTypeCategoryID");
            entity.Property(e => e.Value).HasColumnName("Value");
            entity.Property(e => e.Description).HasMaxLength(50).IsRequired().HasColumnName("Description");
            entity.Property(e => e.Active).HasMaxLength(1).HasColumnName("Active");
            entity.Property(e => e.SortOrder).HasColumnName("SortOrder");
        });

        // Configure ParticleSubTypeCategoryDefinition entity - Has no primary key in database  
        modelBuilder.Entity<ParticleSubTypeCategoryDefinition>(entity =>
        {
            entity.HasNoKey(); // No PK defined in database
            entity.ToTable("ParticleSubTypeCategoryDefinition");
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Description).HasMaxLength(50).IsRequired().HasColumnName("Description");
            entity.Property(e => e.Active).HasMaxLength(1).HasColumnName("Active");
            entity.Property(e => e.SortOrder).HasColumnName("SortOrder");
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
