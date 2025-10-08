using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using LabResultsApi.Data;
using LabResultsApi.DTOs;
using LabResultsApi.Models;

namespace LabResultsApi.Services;

public class UserQualificationService : IUserQualificationService
{
    private readonly LabResultsDbContext _context;
    private readonly ILogger<UserQualificationService> _logger;

    public UserQualificationService(LabResultsDbContext context, ILogger<UserQualificationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<UserQualificationDto> GetUserQualificationAsync(string employeeId, short testId)
    {
        _logger.LogDebug("Getting qualification for employee {EmployeeId} and test {TestId}", employeeId, testId);

        // First, resolve the test's TestStandId
        var test = await _context.Tests
            .FirstOrDefaultAsync(t => t.Id == testId);

        // If test doesn't exist or has no TestStandId, return default "no qualification" DTO
        if (test == null || test.TestStandId == null)
        {
            _logger.LogWarning("Test {TestId} not found or has no TestStandId for employee {EmployeeId}", testId, employeeId);
            return new UserQualificationDto
            {
                EmployeeId = employeeId,
                TestId = testId,
                TestStandId = 0,
                TestStand = "Unknown",
                QualificationLevel = "None",
                QualificationDate = DateTime.MinValue,
                ExpiryDate = null,
                IsExpired = true,
                CanEnter = false,
                CanReview = false,
                CanReviewOwn = false
            };
        }

        var testStandId = test.TestStandId.Value;

        _logger.LogDebug("Looking up qualification for employee {EmployeeId} and TestStandId {TestStandId}", employeeId, testStandId);

        // Get user qualification filtered by both EmployeeId and TestStandId
        var qualification = await _context.LubeTechQualifications
            .FirstOrDefaultAsync(lq => lq.EmployeeId == employeeId && lq.TestStandId == testStandId);

        if (qualification == null)
        {
            _logger.LogInformation("No qualification found for employee {EmployeeId} on TestStandId {TestStandId} (Test {TestId})", employeeId, testStandId, testId);
            return new UserQualificationDto
            {
                EmployeeId = employeeId,
                TestId = testId,
                TestStandId = testStandId,
                TestStand = "Unknown",
                QualificationLevel = "None",
                QualificationDate = DateTime.MinValue,
                ExpiryDate = null,
                IsExpired = true,
                CanEnter = false,
                CanReview = false,
                CanReviewOwn = false
            };
        }

        // Get test stand information
        var testStand = await _context.TestStands
            .FirstOrDefaultAsync(ts => ts.Id == testStandId);

        // Determine capabilities based on qualification level
        var canEnter = qualification.QualificationLevel == "Q" || qualification.QualificationLevel == "QAG";
        var canReview = qualification.QualificationLevel == "QAG" || qualification.QualificationLevel == "MicrE";
        var canReviewOwn = qualification.QualificationLevel == "Q" || qualification.QualificationLevel == "QAG" || qualification.QualificationLevel == "MicrE";

        _logger.LogDebug("Found qualification {QualLevel} for employee {EmployeeId} on TestStandId {TestStandId} (Test {TestId})", 
            qualification.QualificationLevel, employeeId, testStandId, testId);

        return new UserQualificationDto
        {
            EmployeeId = employeeId,
            TestId = testId,
            TestStandId = testStandId,
            TestStand = testStand?.Name ?? "Unknown",
            QualificationLevel = qualification.QualificationLevel ?? "None",
            QualificationDate = DateTime.MinValue, // Not available in database
            ExpiryDate = null, // Not available in database
            IsExpired = false, // Assume not expired if qualification exists
            CanEnter = canEnter,
            CanReview = canReview,
            CanReviewOwn = canReviewOwn
        };
    }

    public async Task<bool> CanUserEnterResultsAsync(string employeeId, short testId)
    {
        var qualification = await GetUserQualificationAsync(employeeId, testId);
        return qualification.CanEnter;
    }

    public async Task<bool> CanUserReviewResultsAsync(string employeeId, short testId, int sampleId)
    {
        var qualification = await GetUserQualificationAsync(employeeId, testId);
        return qualification.CanReview;
    }

    public async Task<object> GetUserQualificationSummaryAsync(string userId)
    {
        var qualifications = await _context.LubeTechQualifications
            .Where(lq => lq.EmployeeId == userId)
            .ToListAsync();

        var testStands = await _context.TestStands.ToListAsync();

        var summary = qualifications.Select(q => new
        {
            TestStandId = q.TestStandId,
            TestStand = testStands.FirstOrDefault(ts => ts.Id == q.TestStandId)?.Name ?? "Unknown",
            QualificationLevel = q.QualificationLevel,
            CanEnter = q.QualificationLevel == "Q" || q.QualificationLevel == "QAG",
            CanReview = q.QualificationLevel == "QAG" || q.QualificationLevel == "MicrE"
        }).ToList();

        return new
        {
            UserId = userId,
            Qualifications = summary,
            TotalQualifications = summary.Count,
            CanEnterAny = summary.Any(s => s.CanEnter),
            CanReviewAny = summary.Any(s => s.CanReview)
        };
    }

    public async Task<List<TestInfoDto>> GetQualifiedTestsForUserAsync(string userId)
    {
        var qualifications = await _context.LubeTechQualifications
            .Where(lq => lq.EmployeeId == userId)
            .ToListAsync();

        var testStandIds = qualifications.Select(q => q.TestStandId).Where(id => id.HasValue).Select(id => id.Value).ToList();

        var tests = await _context.Tests
            .Where(t => testStandIds.Contains(t.TestStandId ?? 0))
            .Select(t => new TestInfoDto
            {
                Id = t.Id ?? 0,
                Name = t.Name,
                Description = null, // Not available in database
                Abbrev = t.Abbrev,
                ShortAbbrev = t.ShortAbbrev,
                TestStandId = t.TestStandId,
                SampleVolumeRequired = t.SampleVolumeRequired,
                Exclude = t.Exclude,
                DisplayGroupId = t.DisplayGroupId,
                GroupName = t.GroupName,
                Lab = t.Lab,
                Schedule = t.Schedule,
                IsActive = true // Assume active if in database
            })
            .ToListAsync();

        return tests;
    }

    public async Task<List<TestInfoDto>> GetUnqualifiedTestsForUserAsync(string userId)
    {
        var qualifiedTests = await GetQualifiedTestsForUserAsync(userId);
        var qualifiedTestIds = qualifiedTests.Select(t => t.Id).ToList();

        var allTests = await _context.Tests
            .Where(t => !qualifiedTestIds.Contains(t.Id ?? 0))
            .Select(t => new TestInfoDto
            {
                Id = t.Id ?? 0,
                Name = t.Name,
                Description = null, // Not available in database
                Abbrev = t.Abbrev,
                ShortAbbrev = t.ShortAbbrev,
                TestStandId = t.TestStandId,
                SampleVolumeRequired = t.SampleVolumeRequired,
                Exclude = t.Exclude,
                DisplayGroupId = t.DisplayGroupId,
                GroupName = t.GroupName,
                Lab = t.Lab,
                Schedule = t.Schedule,
                IsActive = true // Assume active if in database
            })
            .ToListAsync();

        return allTests;
    }

    public async Task<bool> CanUserPerformActionAsync(string userId, short testId, string action)
    {
        var qualification = await GetUserQualificationAsync(userId, testId);

        return action.ToLower() switch
        {
            "enter" => qualification.CanEnter,
            "review" => qualification.CanReview,
            "reviewown" => qualification.CanReviewOwn,
            _ => false
        };
    }

    public async Task<List<UserQualificationDto>> GetTestStandQualificationsAsync(short testStandId)
    {
        var qualifications = await _context.LubeTechQualifications
            .Where(lq => lq.TestStandId == testStandId)
            .ToListAsync();

        var testStand = await _context.TestStands
            .FirstOrDefaultAsync(ts => ts.Id == testStandId);

        return qualifications.Select(q => new UserQualificationDto
        {
            EmployeeId = q.EmployeeId ?? "",
            TestId = 0, // Not specific to a test
            TestStandId = testStandId,
            TestStand = testStand?.Name ?? "Unknown",
            QualificationLevel = q.QualificationLevel ?? "None",
            QualificationDate = DateTime.MinValue, // Not available in database
            ExpiryDate = null, // Not available in database
            IsExpired = false, // Assume not expired if qualification exists
            CanEnter = q.QualificationLevel == "Q" || q.QualificationLevel == "QAG",
            CanReview = q.QualificationLevel == "QAG" || q.QualificationLevel == "MicrE",
            CanReviewOwn = q.QualificationLevel == "Q" || q.QualificationLevel == "QAG" || q.QualificationLevel == "MicrE"
        }).ToList();
    }

    public async Task<List<object>> GetUserTestStandMappingsAsync(string userId)
    {
        var qualifications = await _context.LubeTechQualifications
            .Where(lq => lq.EmployeeId == userId)
            .ToListAsync();

        var testStands = await _context.TestStands.ToListAsync();

        return qualifications.Select(q => new
        {
            EmployeeId = q.EmployeeId,
            TestStandId = q.TestStandId,
            TestStand = testStands.FirstOrDefault(ts => ts.Id == q.TestStandId)?.Name ?? "Unknown",
            QualificationLevel = q.QualificationLevel,
            Capabilities = new
            {
                CanEnter = q.QualificationLevel == "Q" || q.QualificationLevel == "QAG",
                CanReview = q.QualificationLevel == "QAG" || q.QualificationLevel == "MicrE",
                CanReviewOwn = q.QualificationLevel == "Q" || q.QualificationLevel == "QAG" || q.QualificationLevel == "MicrE"
            }
        }).Cast<object>().ToList();
    }
}
