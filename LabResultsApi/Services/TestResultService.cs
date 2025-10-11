using Microsoft.EntityFrameworkCore;
using LabResultsApi.Data;
using LabResultsApi.DTOs;
using LabResultsApi.Models;

namespace LabResultsApi.Services;

public class TestResultService : ITestResultService
{
    private readonly LabResultsDbContext _context;
    private readonly IUserQualificationService _userQualificationService;
    private readonly IParticleAnalysisService _particleAnalysisService;

    public TestResultService(
        LabResultsDbContext context,
        IUserQualificationService userQualificationService,
        IParticleAnalysisService particleAnalysisService)
    {
        _context = context;
        _userQualificationService = userQualificationService;
        _particleAnalysisService = particleAnalysisService;
    }

    public async Task<SampleInfoDto?> GetSampleInfoAsync(int sampleId)
    {
        var sample = await _context.UsedLubeSamples
            .Include(s => s.ComponentNavigation)
            .Include(s => s.LocationNavigation)
            .FirstOrDefaultAsync(s => s.Id == sampleId);

        if (sample == null) return null;

        return new SampleInfoDto
        {
            Id = sample.Id,
            TagNumber = sample.TagNumber,
            Component = sample.Component,
            ComponentName = sample.ComponentNavigation?.Name,
            Location = sample.Location,
            LocationName = sample.LocationNavigation?.Name,
            LubeType = sample.LubeType,
            NewUsedFlag = sample.NewUsedFlag?.ToString(),
            // CNR information would need to be retrieved from another service
        };
    }

    public async Task<TestInfoDto?> GetTestInfoAsync(short testId)
    {
        var test = await _context.Tests.FindAsync(testId);
        if (test == null) return null;

        return new TestInfoDto
        {
            Id = test.Id ?? 0,
            Name = test.Name,
            Abbrev = test.Abbrev,
            ShortAbbrev = test.ShortAbbrev,
            Lab = test.Lab,
            Schedule = test.Schedule
        };
    }

    public async Task<UserQualificationDto> GetUserQualificationAsync(string employeeId, short testId)
    {
        return await _userQualificationService.GetUserQualificationAsync(employeeId, testId);
    }

    public async Task<List<TestResultEntryDto>> GetTestResultsAsync(int sampleId, short testId)
    {
        var results = await _context.TestReadings
            .Where(tr => tr.SampleId == sampleId && tr.TestId == testId)
            .OrderBy(tr => tr.TrialNumber)
            .ToListAsync();

        return results.Select(r => new TestResultEntryDto
        {
            SampleId = r.SampleId,
            TestId = r.TestId,
            TrialNumber = r.TrialNumber,
            Value1 = r.Value1,
            Value2 = r.Value2,
            Value3 = r.Value3,
            TrialCalc = r.TrialCalc,
            Id1 = r.Id1,
            Id2 = r.Id2,
            Id3 = r.Id3,
            Status = r.Status,
            MainComments = r.MainComments
        }).ToList();
    }

    public async Task<TestResultResponseDto> SaveTestResultsAsync(TestResultSaveDto saveDto, string employeeId)
    {
        try
        {
            // Validate user permissions
            var qualification = await GetUserQualificationAsync(employeeId, saveDto.TestId);
            if (!ValidateUserPermissions(qualification, saveDto.Mode))
            {
                return new TestResultResponseDto
                {
                    Success = false,
                    ErrorMessage = "You are not authorized to perform this action"
                };
            }

            // Validate the data
            if (!await ValidateTestResultsAsync(saveDto, employeeId))
            {
                return new TestResultResponseDto
                {
                    Success = false,
                    ErrorMessage = "Validation failed"
                };
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                switch (saveDto.Mode.ToLower())
                {
                    case "entry":
                        await ProcessEntryModeAsync(saveDto, employeeId);
                        break;
                    case "reviewaccept":
                        await ProcessReviewAcceptModeAsync(saveDto, employeeId);
                        break;
                    case "reviewreject":
                        await ProcessReviewRejectModeAsync(saveDto, employeeId);
                        break;
                    default:
                        throw new ArgumentException($"Invalid mode: {saveDto.Mode}");
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new TestResultResponseDto { Success = true };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new TestResultResponseDto
                {
                    Success = false,
                    ErrorMessage = ex.Message
                };
            }
        }
        catch (Exception ex)
        {
            return new TestResultResponseDto
            {
                Success = false,
                ErrorMessage = ex.Message
            };
        }
    }

    public async Task<bool> ValidateTestResultsAsync(TestResultSaveDto saveDto, string employeeId)
    {
        // Implement validation logic based on test type and business rules
        // This would include checking required fields, data ranges, etc.
        return true; // Simplified for now
    }

    public async Task<List<ParticleTypeDto>> GetParticleTypesAsync(int sampleId, short testId)
    {
        return await _particleAnalysisService.GetParticleTypesAsync(sampleId, testId);
    }

    public async Task<bool> SaveParticleTypesAsync(int sampleId, short testId, List<ParticleTypeDto> particleTypes)
    {
        return await _particleAnalysisService.SaveParticleTypesAsync(sampleId, testId, particleTypes);
    }

    private bool ValidateUserPermissions(UserQualificationDto qualification, string mode)
    {
        return mode.ToLower() switch
        {
            "entry" => qualification.CanEnter,
            "reviewaccept" or "reviewreject" => qualification.CanReview,
            _ => false
        };
    }

    private async Task ProcessEntryModeAsync(TestResultSaveDto saveDto, string employeeId)
    {
        var now = DateTime.UtcNow;
        var status = DetermineStatus(saveDto, employeeId);

        foreach (var entry in saveDto.Entries.Where(e => e.TrialNumber > 0))
        {
            var existing = await _context.TestReadings.FindAsync(entry.SampleId, entry.TestId, entry.TrialNumber);
            
            if (existing == null)
            {
                var newReading = new TestReading
                {
                    SampleId = entry.SampleId,
                    TestId = entry.TestId,
                    TrialNumber = entry.TrialNumber,
                    Value1 = entry.Value1,
                    Value2 = entry.Value2,
                    Value3 = entry.Value3,
                    TrialCalc = entry.TrialCalc,
                    Id1 = entry.Id1,
                    Id2 = entry.Id2,
                    Id3 = entry.Id3,
                    Status = status,
                    EntryId = employeeId,
                    EntryDate = now,
                    MainComments = entry.MainComments,
                    TrialComplete = false
                };
                _context.TestReadings.Add(newReading);
            }
            else
            {
                existing.Value1 = entry.Value1;
                existing.Value2 = entry.Value2;
                existing.Value3 = entry.Value3;
                existing.TrialCalc = entry.TrialCalc;
                existing.Id1 = entry.Id1;
                existing.Id2 = entry.Id2;
                existing.Id3 = entry.Id3;
                existing.Status = status;
                existing.MainComments = entry.MainComments;
            }
        }
    }

    private async Task ProcessReviewAcceptModeAsync(TestResultSaveDto saveDto, string employeeId)
    {
        var now = DateTime.UtcNow;
        
        var readings = await _context.TestReadings
            .Where(tr => tr.SampleId == saveDto.SampleId && tr.TestId == saveDto.TestId)
            .ToListAsync();

        foreach (var reading in readings)
        {
            reading.Status = "D"; // Done/Validated
            reading.ValidateId = employeeId;
            reading.ValiDate = now;
        }
    }

    private async Task ProcessReviewRejectModeAsync(TestResultSaveDto saveDto, string employeeId)
    {
        // Delete existing readings and create new ones with "A" status
        var existingReadings = await _context.TestReadings
            .Where(tr => tr.SampleId == saveDto.SampleId && tr.TestId == saveDto.TestId)
            .ToListAsync();

        _context.TestReadings.RemoveRange(existingReadings);

        // Add new reading with "A" status (Awaiting results)
        var newReading = new TestReading
        {
            SampleId = saveDto.SampleId,
            TestId = saveDto.TestId,
            TrialNumber = 1,
            Status = "A"
        };
        _context.TestReadings.Add(newReading);
    }

    private string DetermineStatus(TestResultSaveDto saveDto, string employeeId)
    {
        if (saveDto.IsPartialSave)
        {
            return saveDto.TestId == 210 ? "P" : "A"; // Partial or Awaiting
        }
        
        if (saveDto.IsMediaReady)
        {
            return "E"; // Ready for microscope
        }

        return "S"; // Saved
    }

    // CRUD operations
    public async Task<TestResultEntryDto> SaveTestResultAsync(TestResultEntryDto dto)
    {
        var testReading = new TestReading
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Value1 = dto.Value1,
            Value2 = dto.Value2,
            Value3 = dto.Value3,
            TrialCalc = dto.TrialCalc,
            Id1 = dto.Id1,
            Id2 = dto.Id2,
            Id3 = dto.Id3,
            Status = dto.Status,
            EntryId = dto.EntryId,
            EntryDate = dto.EntryDate,
            MainComments = dto.MainComments
        };

        _context.TestReadings.Add(testReading);
        await _context.SaveChangesAsync();

        return dto;
    }

    public async Task<TestResultEntryDto> UpdateTestResultAsync(int sampleId, int testId, TestResultEntryDto dto)
    {
        var existing = await _context.TestReadings
            .FirstOrDefaultAsync(tr => tr.SampleId == sampleId && tr.TestId == testId && tr.TrialNumber == dto.TrialNumber);

        if (existing == null)
            throw new ArgumentException("Test result not found");

        existing.Value1 = dto.Value1;
        existing.Value2 = dto.Value2;
        existing.Value3 = dto.Value3;
        existing.TrialCalc = dto.TrialCalc;
        existing.Id1 = dto.Id1;
        existing.Id2 = dto.Id2;
        existing.Id3 = dto.Id3;
        existing.Status = dto.Status;
        existing.MainComments = dto.MainComments;

        await _context.SaveChangesAsync();
        return dto;
    }

    public async Task DeleteTestResultAsync(int sampleId, int testId)
    {
        var results = await _context.TestReadings
            .Where(tr => tr.SampleId == sampleId && tr.TestId == testId)
            .ToListAsync();

        _context.TestReadings.RemoveRange(results);
        await _context.SaveChangesAsync();
    }

    // Test-specific save methods
    public async Task<TestResultEntryDto> SaveTanTestAsync(TanTestDto dto)
    {
        // Calculate TAN result: ((FinalBuret * 5.61) / SampleWeight) * 100
        var tanResult = dto.SampleWeight > 0 ? Math.Round(((dto.FinalBuret * 5.61) / dto.SampleWeight) * 100, 2) : 0;
        if (tanResult < 0.01) tanResult = 0.01;

        var testResult = new TestResultEntryDto
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Value1 = dto.SampleWeight,
            Value2 = tanResult,
            Value3 = dto.FinalBuret,
            Id1 = dto.EquipmentId,
            Status = dto.Status,
            EntryId = dto.EntryId,
            EntryDate = dto.EntryDate ?? DateTime.Now,
            MainComments = dto.Comments
        };

        return await SaveTestResultAsync(testResult);
    }

    public async Task<TestResultEntryDto> SaveEmissionSpectroTestAsync(EmissionSpectroDto dto)
    {
        // Save to EmSpectro table
        var emSpectro = new EmSpectro
        {
            TestId = dto.TestId,
            Na = dto.Na,
            Mo = dto.Mo,
            Mg = dto.Mg,
            P = dto.P,
            B = dto.B,
            H = dto.H,
            Cr = dto.Cr,
            Ca = dto.Ca,
            Ni = dto.Ni,
            Ag = dto.Ag,
            Cu = dto.Cu,
            Sn = dto.Sn,
            Al = dto.Al,
            Mn = dto.Mn,
            Pb = dto.Pb,
            Fe = dto.Fe,
            Si = dto.Si,
            Ba = dto.Ba,
            Sb = dto.Sb,
            Zn = dto.Zn,
            TrialDate = dto.TrialDate ?? DateTime.Now,
            TrialNum = dto.TrialNumber
        };

        _context.EmSpectros.Add(emSpectro);

        // Save to TestReadings table
        var testResult = new TestResultEntryDto
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Status = dto.Status,
            EntryId = dto.EntryId,
            EntryDate = dto.EntryDate ?? DateTime.Now,
            MainComments = dto.Comments
        };

        await _context.SaveChangesAsync();
        return testResult;
    }

    public async Task<TestResultEntryDto> SaveViscosityTestAsync(ViscosityTestDto dto)
    {
        // Calculate viscosity result: calibration * stopWatchTime
        var calibration = 1.0; // This would come from the viscometer equipment
        var viscosityResult = calibration * dto.StopWatchTime;

        var testResult = new TestResultEntryDto
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Value1 = dto.StopWatchTime,
            Value2 = viscosityResult,
            Id1 = dto.TimerMteId,
            Id2 = dto.ViscometerId,
            Id3 = dto.ThermometerMteId,
            Status = dto.Status,
            EntryId = dto.EntryId,
            EntryDate = dto.EntryDate ?? DateTime.Now,
            MainComments = dto.Comments
        };

        return await SaveTestResultAsync(testResult);
    }

    public async Task<TestResultEntryDto> SaveFtirTestAsync(FtirTestDto dto)
    {
        // Save to FTIR table
        var ftir = new FTIR
        {
            SampleId = dto.SampleId,
            Contam = dto.DeltaArea,
            AntiOxidant = dto.AntiOxidant,
            Oxidation = dto.Oxidation,
            H2O = dto.H2O,
            Zddp = dto.AntiWear,
            Soot = dto.Soot,
            FuelDilution = dto.FuelDilution,
            Mixture = dto.Mixture,
            NLGI = dto.WeakAcid
        };

        _context.FTIRs.Add(ftir);

        // Save to TestReadings table
        var testResult = new TestResultEntryDto
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Status = dto.Status,
            EntryId = dto.EntryId,
            EntryDate = dto.EntryDate ?? DateTime.Now,
            MainComments = dto.Comments
        };

        await _context.SaveChangesAsync();
        return testResult;
    }

    public async Task<TestResultEntryDto> SaveFlashPointTestAsync(FlashPointTestDto dto)
    {
        // Calculate flash point result: fptemp + (0.06 * (760 - pressure))
        var flashPointResult = dto.FlashPointTemperature + (0.06 * (760 - dto.BarometricPressure));
        flashPointResult = Math.Round(flashPointResult / 2) * 2; // Round to nearest even number

        var testResult = new TestResultEntryDto
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Value1 = dto.BarometricPressure,
            Value2 = dto.FlashPointTemperature,
            Value3 = flashPointResult,
            Id1 = dto.BarometerMteId,
            Id2 = dto.ThermometerMteId,
            Status = dto.Status,
            EntryId = dto.EntryId,
            EntryDate = dto.EntryDate ?? DateTime.Now,
            MainComments = dto.Comments
        };

        return await SaveTestResultAsync(testResult);
    }

    public async Task<TestResultEntryDto> SaveParticleCountTestAsync(ParticleCountTestDto dto)
    {
        // Save to ParticleCount table
        var particleCount = new ParticleCount
        {
            Micron5_10 = dto.Micron5_10,
            Micron10_15 = dto.Micron10_15,
            Micron15_25 = dto.Micron15_25,
            Micron25_50 = dto.Micron25_50,
            Micron50_100 = dto.Micron50_100,
            Micron100 = dto.Micron100,
            IsoCode = dto.IsoCode,
            NasClass = dto.NasClass,
            TestDate = dto.TestDate ?? DateTime.Now
        };

        _context.ParticleCounts.Add(particleCount);

        // Save to TestReadings table
        var testResult = new TestResultEntryDto
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Status = dto.Status,
            EntryId = dto.EntryId,
            EntryDate = dto.EntryDate ?? DateTime.Now,
            MainComments = dto.Comments
        };

        await _context.SaveChangesAsync();
        return testResult;
    }

    public async Task<TestResultEntryDto> SaveGreasePenetrationTestAsync(GreasePenetrationTestDto dto)
    {
        // Calculate average penetration and result
        var average = Math.Round((dto.FirstPenetration + dto.SecondPenetration + dto.ThirdPenetration) / 3);
        var result = (average * 3.75) + 24;

        var testResult = new TestResultEntryDto
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Value1 = dto.FirstPenetration,
            Value2 = dto.SecondPenetration,
            Value3 = dto.ThirdPenetration,
            TrialCalc = result,
            Id1 = dto.Nlgi,
            Status = dto.Status,
            EntryId = dto.EntryId,
            EntryDate = dto.EntryDate ?? DateTime.Now,
            MainComments = dto.Comments
        };

        return await SaveTestResultAsync(testResult);
    }

    public async Task<TestResultEntryDto> SaveDroppingPointTestAsync(DroppingPointTestDto dto)
    {
        // Calculate dropping point result: odp + ((bt - odp) / 3)
        var droppingPointResult = dto.DroppingPointTemperature + ((dto.BlockTemperature - dto.DroppingPointTemperature) / 3);

        var testResult = new TestResultEntryDto
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Value1 = dto.DroppingPointTemperature,
            Value2 = Math.Round(droppingPointResult),
            Value3 = dto.BlockTemperature,
            Id1 = dto.DroppingPointThermometerId,
            Id2 = dto.BlockThermometerId,
            Status = dto.Status,
            EntryId = dto.EntryId,
            EntryDate = dto.EntryDate ?? DateTime.Now,
            MainComments = dto.Comments
        };

        return await SaveTestResultAsync(testResult);
    }

    public async Task<TestResultEntryDto> SaveRbotTestAsync(RbotTestDto dto)
    {
        var testResult = new TestResultEntryDto
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Value1 = dto.FailTime,
            Id1 = dto.ThermometerMteId,
            Status = dto.Status,
            EntryId = dto.EntryId,
            EntryDate = dto.EntryDate ?? DateTime.Now,
            MainComments = dto.Comments
        };

        return await SaveTestResultAsync(testResult);
    }

    public async Task<TestResultEntryDto> SaveOxidationStabilityTestAsync(OxidationStabilityTestDto dto)
    {
        var testResult = new TestResultEntryDto
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Value1 = dto.PassFailResult,
            Id1 = dto.ThermometerMteId,
            Status = dto.Status,
            EntryId = dto.EntryId,
            EntryDate = dto.EntryDate ?? DateTime.Now,
            MainComments = dto.Comments
        };

        return await SaveTestResultAsync(testResult);
    }

    public async Task<TestResultEntryDto> SaveDeleteriousTestAsync(DeleteriousTestDto dto)
    {
        var testResult = new TestResultEntryDto
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Value1 = dto.Pressure,
            Value2 = dto.Scratches,
            Id1 = dto.DeleteriousMteId,
            Id2 = dto.PassFail,
            Status = dto.Status,
            EntryId = dto.EntryId,
            EntryDate = dto.EntryDate ?? DateTime.Now,
            MainComments = dto.Comments
        };

        return await SaveTestResultAsync(testResult);
    }

    public async Task<TestResultEntryDto> SaveRheometerTestAsync(RheometerTestDto dto)
    {
        var testResult = new TestResultEntryDto
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Value1 = dto.DInch ?? dto.OilContent ?? dto.VarnishPotentialRating ?? 0,
            Status = dto.Status,
            EntryId = dto.EntryId,
            EntryDate = dto.EntryDate ?? DateTime.Now,
            MainComments = dto.Comments
        };

        return await SaveTestResultAsync(testResult);
    }

    public async Task<TestResultEntryDto> SaveFileDataTestAsync(FileDataTestDto dto)
    {
        var testResult = new TestResultEntryDto
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Value1 = (double?)dto.Value1,
            Status = "S",
            EntryDate = DateTime.Now,
            MainComments = dto.FileContent
        };

        return await SaveTestResultAsync(testResult);
    }

    public async Task<object> GetTestStatusAsync(int sampleId, short testId)
    {
        var testReading = await _context.TestReadings
            .FirstOrDefaultAsync(tr => tr.SampleId == sampleId && tr.TestId == testId);

        return new
        {
            SampleId = sampleId,
            TestId = testId,
            Status = testReading?.Status ?? "X",
            EntryDate = testReading?.EntryDate,
            EntryId = testReading?.EntryId
        };
    }

    public async Task<bool> UpdateTestStatusAsync(TestStatusUpdateDto dto)
    {
        var testReading = await _context.TestReadings
            .FirstOrDefaultAsync(tr => tr.SampleId == dto.SampleId && tr.TestId == dto.TestId);

        if (testReading == null) return false;

        testReading.Status = dto.NewStatus;
        if (!string.IsNullOrEmpty(dto.Comments))
        {
            testReading.MainComments = dto.Comments;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<object> GetTestWorkflowAsync(short testId)
    {
        var test = await _context.Tests.FindAsync(testId);
        if (test == null) return new { };

        return new
        {
            TestId = testId,
            TestName = test.Name,
            WorkflowSteps = new[] { "entry", "review", "approval" },
            RequiredQualifications = new[] { "Q", "QAG", "MicrE" }
        };
    }

    public async Task<object> GetSaveStatusAsync(int sampleId, short testId)
    {
        var testReading = await _context.TestReadings
            .FirstOrDefaultAsync(tr => tr.SampleId == sampleId && tr.TestId == testId);

        return new
        {
            SampleId = sampleId,
            TestId = testId,
            HasData = testReading != null,
            Status = testReading?.Status ?? "X",
            CanSave = true,
            CanDelete = testReading != null
        };
    }

    public async Task<object> GetComprehensiveTestInfoAsync(short testId)
    {
        var test = await _context.Tests.FindAsync(testId);
        if (test == null) return new { };

        return new
        {
            TestId = testId,
            TestName = test.Name,
            Description = test.Name, // Use Name as description since Description property was removed
            Requirements = new[] { "Valid equipment", "User qualification", "Sample preparation" },
            Equipment = new[] { "Thermometer", "Timer", "Test apparatus" }
        };
    }

    public async Task<List<TestResultEntryDto>> GetTestsPendingReviewForUserAsync(string userId)
    {
        var pendingTests = await _context.TestReadings
            .Where(tr => tr.Status == "T" || tr.Status == "E")
            .Select(tr => new TestResultEntryDto
            {
                SampleId = tr.SampleId,
                TestId = tr.TestId,
                TrialNumber = tr.TrialNumber,
                Status = tr.Status,
                EntryDate = tr.EntryDate,
                EntryId = tr.EntryId
            })
            .ToListAsync();

        return pendingTests;
    }

    // Additional test-specific save methods
    public async Task<TestResultEntryDto> SaveSimpleResultTestAsync(SimpleResultTestDto dto)
    {
        var testReading = new TestReading
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Status = dto.Status,
            EntryDate = DateTime.UtcNow,
            EntryId = dto.EntryId,
            Value1 = dto.Result
        };

        _context.TestReadings.Add(testReading);
        await _context.SaveChangesAsync();

        return new TestResultEntryDto
        {
            SampleId = testReading.SampleId,
            TestId = testReading.TestId,
            TrialNumber = testReading.TrialNumber,
            Status = testReading.Status,
            EntryDate = testReading.EntryDate,
            EntryId = testReading.EntryId
        };
    }

    public async Task<TestResultEntryDto> SaveFilterInspectionTestAsync(FilterInspectionTestDto dto)
    {
        var testReading = new TestReading
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Status = dto.Status,
            EntryDate = DateTime.UtcNow,
            EntryId = dto.EntryId,
            Value1 = double.TryParse(dto.FilterCondition, out var filterValue) ? filterValue : null,
            MainComments = dto.Comments
        };

        _context.TestReadings.Add(testReading);
        await _context.SaveChangesAsync();

        return new TestResultEntryDto
        {
            SampleId = testReading.SampleId,
            TestId = testReading.TestId,
            TrialNumber = testReading.TrialNumber,
            Status = testReading.Status,
            EntryDate = testReading.EntryDate,
            EntryId = testReading.EntryId
        };
    }

    public async Task<TestResultEntryDto> SaveFilterResidueTestAsync(FilterResidueTestDto dto)
    {
        var testReading = new TestReading
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Status = dto.Status,
            EntryDate = DateTime.UtcNow,
            EntryId = dto.EntryId,
            Value1 = dto.ResidueWeight,
            MainComments = dto.Comments
        };

        _context.TestReadings.Add(testReading);
        await _context.SaveChangesAsync();

        return new TestResultEntryDto
        {
            SampleId = testReading.SampleId,
            TestId = testReading.TestId,
            TrialNumber = testReading.TrialNumber,
            Status = testReading.Status,
            EntryDate = testReading.EntryDate,
            EntryId = testReading.EntryId
        };
    }

    public async Task<TestResultEntryDto> SaveSimpleSelectTestAsync(SimpleSelectTestDto dto)
    {
        var testReading = new TestReading
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Status = dto.Status,
            EntryDate = DateTime.UtcNow,
            EntryId = dto.EntryId,
            Value1 = double.TryParse(dto.SelectedValue, out var selectedValue) ? selectedValue : null,
            MainComments = dto.Comments
        };

        _context.TestReadings.Add(testReading);
        await _context.SaveChangesAsync();

        return new TestResultEntryDto
        {
            SampleId = testReading.SampleId,
            TestId = testReading.TestId,
            TrialNumber = testReading.TrialNumber,
            Status = testReading.Status,
            EntryDate = testReading.EntryDate,
            EntryId = testReading.EntryId
        };
    }

    public async Task<TestResultEntryDto> SaveRbotFailTimeTestAsync(RbotFailTimeTestDto dto)
    {
        var testReading = new TestReading
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Status = dto.Status,
            EntryDate = DateTime.UtcNow,
            EntryId = dto.EntryId,
            Value1 = dto.FailTime,
            MainComments = dto.Comments
        };

        _context.TestReadings.Add(testReading);
        await _context.SaveChangesAsync();

        return new TestResultEntryDto
        {
            SampleId = testReading.SampleId,
            TestId = testReading.TestId,
            TrialNumber = testReading.TrialNumber,
            Status = testReading.Status,
            EntryDate = testReading.EntryDate,
            EntryId = testReading.EntryId
        };
    }

    public async Task<TestResultEntryDto> SaveInspectFilterTestAsync(InspectFilterTestDto dto)
    {
        var testReading = new TestReading
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Status = dto.Status,
            EntryDate = DateTime.UtcNow,
            EntryId = dto.EntryId,
            Value1 = double.TryParse(dto.InspectionResult, out var inspectionValue) ? inspectionValue : null,
            MainComments = dto.Comments
        };

        _context.TestReadings.Add(testReading);
        await _context.SaveChangesAsync();

        return new TestResultEntryDto
        {
            SampleId = testReading.SampleId,
            TestId = testReading.TestId,
            TrialNumber = testReading.TrialNumber,
            Status = testReading.Status,
            EntryDate = testReading.EntryDate,
            EntryId = testReading.EntryId
        };
    }

    public async Task<TestResultEntryDto> SaveDInchTestAsync(DInchTestDto dto)
    {
        var testReading = new TestReading
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Status = dto.Status,
            EntryDate = DateTime.UtcNow,
            EntryId = dto.EntryId,
            Value1 = dto.DInchValue,
            MainComments = dto.Comments
        };

        _context.TestReadings.Add(testReading);
        await _context.SaveChangesAsync();

        return new TestResultEntryDto
        {
            SampleId = testReading.SampleId,
            TestId = testReading.TestId,
            TrialNumber = testReading.TrialNumber,
            Status = testReading.Status,
            EntryDate = testReading.EntryDate,
            EntryId = testReading.EntryId
        };
    }

    public async Task<TestResultEntryDto> SaveOilContentTestAsync(OilContentTestDto dto)
    {
        var testReading = new TestReading
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Status = dto.Status,
            EntryDate = DateTime.UtcNow,
            EntryId = dto.EntryId,
            Value1 = dto.OilContent,
            MainComments = dto.Comments
        };

        _context.TestReadings.Add(testReading);
        await _context.SaveChangesAsync();

        return new TestResultEntryDto
        {
            SampleId = testReading.SampleId,
            TestId = testReading.TestId,
            TrialNumber = testReading.TrialNumber,
            Status = testReading.Status,
            EntryDate = testReading.EntryDate,
            EntryId = testReading.EntryId
        };
    }

    public async Task<TestResultEntryDto> SaveVarnishPotentialTestAsync(VarnishPotentialTestDto dto)
    {
        var testReading = new TestReading
        {
            SampleId = dto.SampleId,
            TestId = dto.TestId,
            TrialNumber = dto.TrialNumber,
            Status = dto.Status,
            EntryDate = DateTime.UtcNow,
            EntryId = dto.EntryId,
            Value1 = dto.VarnishPotential,
            MainComments = dto.Comments
        };

        _context.TestReadings.Add(testReading);
        await _context.SaveChangesAsync();

        return new TestResultEntryDto
        {
            SampleId = testReading.SampleId,
            TestId = testReading.TestId,
            TrialNumber = testReading.TrialNumber,
            Status = testReading.Status,
            EntryDate = testReading.EntryDate,
            EntryId = testReading.EntryId
        };
    }
}
