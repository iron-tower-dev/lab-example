using LabResultsApi.DTOs;

namespace LabResultsApi.Services;

public interface IUserQualificationService
{
    Task<UserQualificationDto> GetUserQualificationAsync(string employeeId, short testId);
    Task<bool> CanUserEnterResultsAsync(string employeeId, short testId);
    Task<bool> CanUserReviewResultsAsync(string employeeId, short testId, int sampleId);
    
    // Additional qualification methods
    Task<object> GetUserQualificationSummaryAsync(string userId);
    Task<List<TestInfoDto>> GetQualifiedTestsForUserAsync(string userId);
    Task<List<TestInfoDto>> GetUnqualifiedTestsForUserAsync(string userId);
    Task<bool> CanUserPerformActionAsync(string userId, short testId, string action);
    Task<List<UserQualificationDto>> GetTestStandQualificationsAsync(short testStandId);
    Task<List<object>> GetUserTestStandMappingsAsync(string userId);
}
