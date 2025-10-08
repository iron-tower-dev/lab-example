using Microsoft.EntityFrameworkCore;
using LabResultsApi.Data;
using LabResultsApi.DTOs;

namespace LabResultsApi.Services;

public class UserQualificationService : IUserQualificationService
{
    private readonly LabResultsDbContext _context;

    public UserQualificationService(LabResultsDbContext context)
    {
        _context = context;
    }

    public async Task<UserQualificationDto> GetUserQualificationAsync(string employeeId, short testId)
    {
        var qualification = await _context.LubeTechQualifications
            .Include(lq => lq.TestStandId)
            .Where(lq => lq.EmployeeId == employeeId)
            .Join(_context.Tests,
                lq => lq.TestStandId,
                t => t.TestStandId,
                (lq, t) => new { lq, t })
            .Where(x => x.t.Id == testId)
            .Select(x => x.lq.QualificationLevel)
            .FirstOrDefaultAsync();

        var qualificationLevel = qualification ?? string.Empty;

        return new UserQualificationDto
        {
            EmployeeId = employeeId,
            QualificationLevel = qualificationLevel,
            CanEnter = CanEnterResults(qualificationLevel),
            CanReview = CanReviewResults(qualificationLevel),
            CanReviewOwn = false // This would need additional logic to check if user can review their own results
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
        
        if (!qualification.CanReview) return false;

        // Check if user is trying to review their own results
        var entryId = await _context.TestReadings
            .Where(tr => tr.SampleId == sampleId && tr.TestId == testId)
            .Select(tr => tr.EntryId)
            .FirstOrDefaultAsync();

        if (entryId == employeeId && !qualification.CanReviewOwn)
        {
            return false;
        }

        return true;
    }

    private static bool CanEnterResults(string qualificationLevel)
    {
        return qualificationLevel switch
        {
            "Q/QAG" or "MicrE" or "TRAIN" => true,
            _ => false
        };
    }

    private static bool CanReviewResults(string qualificationLevel)
    {
        return qualificationLevel switch
        {
            "Q/QAG" or "MicrE" => true,
            _ => false
        };
    }

    public async Task<object> GetUserQualificationSummaryAsync(string userId)
    {
        var qualifications = await _context.LubeTechQualifications
            .Where(lq => lq.EmployeeId == userId)
            .CountAsync();

        var qualifiedTests = await _context.LubeTechQualifications
            .Where(lq => lq.EmployeeId == userId && 
                        (lq.QualificationLevel == "Q" || lq.QualificationLevel == "QAG" || lq.QualificationLevel == "MicrE"))
            .CountAsync();

        return new
        {
            UserId = userId,
            TotalTests = qualifications,
            QualifiedTests = qualifiedTests,
            UnqualifiedTests = qualifications - qualifiedTests
        };
    }

    public async Task<List<TestInfoDto>> GetQualifiedTestsForUserAsync(string userId)
    {
        var qualifiedTests = await _context.LubeTechQualifications
            .Where(lq => lq.EmployeeId == userId && 
                        (lq.QualificationLevel == "Q" || lq.QualificationLevel == "QAG" || lq.QualificationLevel == "MicrE"))
            .Join(_context.Tests,
                lq => lq.TestStandId,
                t => t.TestStandId,
                (lq, t) => new TestInfoDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                    IsActive = t.Active ?? false
                })
            .ToListAsync();

        return qualifiedTests;
    }

    public async Task<List<TestInfoDto>> GetUnqualifiedTestsForUserAsync(string userId)
    {
        var allTests = await _context.Tests.ToListAsync();
        var qualifiedTestIds = await _context.LubeTechQualifications
            .Where(lq => lq.EmployeeId == userId && 
                        (lq.QualificationLevel == "Q" || lq.QualificationLevel == "QAG" || lq.QualificationLevel == "MicrE"))
            .Join(_context.Tests,
                lq => lq.TestStandId,
                t => t.TestStandId,
                (lq, t) => t.Id)
            .ToListAsync();

        var unqualifiedTests = allTests
            .Where(t => !qualifiedTestIds.Contains(t.Id))
            .Select(t => new TestInfoDto
            {
                Id = t.Id,
                Name = t.Name,
                Description = t.Description,
                IsActive = t.Active ?? false
            })
            .ToList();

        return unqualifiedTests;
    }

    public async Task<bool> CanUserPerformActionAsync(string userId, short testId, string action)
    {
        var qualification = await GetUserQualificationAsync(userId, testId);
        
        return action.ToLower() switch
        {
            "entry" => qualification.CanEnter,
            "review" => qualification.CanReview,
            "approve" => qualification.QualificationLevel == "QAG" || qualification.QualificationLevel == "MicrE",
            _ => false
        };
    }

    public async Task<List<UserQualificationDto>> GetTestStandQualificationsAsync(short testStandId)
    {
        var qualifications = await _context.LubeTechQualifications
            .Where(lq => lq.TestStandId == testStandId)
            .Select(lq => new UserQualificationDto
            {
                EmployeeId = lq.EmployeeId,
                TestId = testStandId,
                QualificationLevel = lq.QualificationLevel,
                QualificationDate = lq.QualificationDate,
                ExpiryDate = lq.ExpiryDate,
                IsExpired = lq.ExpiryDate.HasValue && lq.ExpiryDate < DateTime.Now
            })
            .ToListAsync();

        return qualifications;
    }

    public async Task<List<object>> GetUserTestStandMappingsAsync(string userId)
    {
        var mappings = await _context.LubeTechQualifications
            .Where(lq => lq.EmployeeId == userId)
            .Select(lq => new
            {
                TestStandId = lq.TestStandId,
                QualificationLevel = lq.QualificationLevel,
                QualificationDate = lq.QualificationDate
            })
            .ToListAsync();

        return mappings.Cast<object>().ToList();
    }
}
