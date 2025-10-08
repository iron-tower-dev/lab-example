using LabResultsApi.DTOs;

namespace LabResultsApi.Services;

public interface IMockDataService
{
    // Equipment data
    Task<List<EquipmentDto>> GetAllEquipmentAsync();
    Task<List<EquipmentDto>> GetEquipmentByTypeAsync(string equipType);
    Task<List<EquipmentDto>> GetEquipmentForTestAsync(int testId);
    Task<List<EquipmentDto>> GetEquipmentByTypeAndTestAsync(string equipType, int testId);
    Task<EquipmentDto?> GetEquipmentByIdAsync(int id);
    Task<EquipmentDto?> GetEquipmentByNameAsync(string equipName);
    Task<List<EquipmentTypeDto>> GetEquipmentTypesAsync();
    Task<List<EquipmentTypeDto>> GetEquipmentTypesForTestAsync(int testId);
    Task<List<EquipmentDto>> GetOverdueEquipmentAsync();
    Task<List<EquipmentDto>> GetEquipmentExpiringWithinDaysAsync(int days);
    Task<EquipmentDto> AddEquipmentAsync(EquipmentDto equipment);
    Task<EquipmentDto?> UpdateEquipmentAsync(int id, EquipmentDto updates);
    Task<bool> DeleteEquipmentAsync(int id);
    Task<object?> GetViscometerCalibrationAsync(string equipName);
    Task<bool> IsEquipmentSuitableForTestAsync(string equipName, int testId);
    Task<string> GetEquipmentStatusAsync(string equipName);
    Task<string> GetEquipmentSuffixAsync(string equipName);
    Task<object?> GetEquipmentWithDueDateInfoAsync(string equipName);
    Task<Dictionary<string, int>> GetEquipmentUsageStatsAsync();
    Task<List<EquipmentDto>> GetMaintenanceScheduleAsync();
    Task<object> ValidateEquipmentForTestAsync(string equipName, int testId, string equipType);

    // User qualification data
    Task<List<UserQualificationDto>> GetUserQualificationsAsync(string userId);
    Task<string?> IsUserQualifiedAsync(string userId, int testId);
    Task<string?> IsUserQualifiedToReviewAsync(string userId, int testId);
    Task<bool> CanUserPerformActionAsync(string userId, int testId, string action);
    Task<List<TestStandDto>> GetTestStandsAsync();
    Task<List<QualificationLevelDto>> GetQualificationLevelsAsync();
    Task<UserQualificationDto> SaveUserQualificationAsync(UserQualificationDto qualification);
    Task<bool> RemoveUserQualificationAsync(string employeeId, int testStandId);
    Task<List<UserQualificationDto>> GetUsersByQualificationAsync(int testId, string qualificationLevel);
    Task<bool> CanEnterResultsAsync(string userId, int testId);
    Task<bool> CanReviewResultsAsync(string userId, int testId);
    Task<bool> CanAcceptResultsAsync(string userId, int testId);
    Task<bool> CanRejectResultsAsync(string userId, int testId);
    Task<bool> CanDeleteResultsAsync(string userId, int testId);
    Task<bool> CanPartialSaveAsync(string userId, int testId);
    Task<bool> HasMicroscopyPermissionsAsync(string userId);
    Task<string?> GetHighestQualificationLevelAsync(string userId);
    Task<bool> IsSupervisorAsync(string userId);
    Task<List<UserQualificationDto>> GetSupervisorsAsync();

    // Status management data
    Task<List<TestStatusDto>> GetAllStatusesAsync();
    Task<TestStatusDto?> GetStatusByCodeAsync(string code);
    Task<TestWorkflowDto?> GetTestWorkflowAsync(int testId);
    Task<StatusTransitionDto> IsStatusTransitionAllowedAsync(string fromStatus, string toStatus, int testId);
    Task<List<TestStatusDto>> GetNextPossibleStatusesAsync(string currentStatus, int testId);
    Task<bool> RequiresReviewAsync(string status);
    Task<bool> IsFinalStatusAsync(string status);
    Task<string> GetStatusColorAsync(string status);
    Task<string> GetStatusDescriptionAsync(string status);
    Task<bool> IsPartialSaveAllowedAsync(int testId);
    Task<bool> IsDeleteAllowedAsync(int testId);
    Task<bool> IsReviewRequiredAsync(int testId);
    Task<string> GetPartialSaveStatusAsync(int testId, string userQualification);
    Task<string> GetFullSaveStatusAsync(int testId, string userQualification);
    Task<string> GetMediaReadyStatusAsync(int testId);
    Task<string> GetTrainingStatusAsync();
    Task<string> GetValidationStatusAsync();
    Task<string> GetCancellationStatusAsync();
    Task<bool> CanPerformActionAsync(string action, string currentStatus, int testId, string userQualification);
    Task<List<object>> GetStatusWorkflowForDisplayAsync(int testId);
    Task<Dictionary<string, int>> GetStatusStatisticsAsync(int testId);
    Task<List<TestResultStatusDto>> GetOverdueTestsAsync();
    Task<List<TestResultStatusDto>> GetTestsPendingReviewAsync();
}
