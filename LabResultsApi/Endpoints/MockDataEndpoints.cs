using LabResultsApi.Services;
using LabResultsApi.DTOs;

namespace LabResultsApi.Endpoints;

public static class MockDataEndpoints
{
    public static void MapMockDataEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/mock")
            .WithTags("Mock Data");

        // Equipment endpoints
        group.MapGet("/equipment", async (IMockDataService mockDataService) =>
        {
            var equipment = await mockDataService.GetAllEquipmentAsync();
            return Results.Ok(equipment);
        })
        .WithName("GetMockAllEquipment")
        .WithSummary("Get all equipment");

        group.MapGet("/equipment/type/{equipType}", async (string equipType, IMockDataService mockDataService) =>
        {
            var equipment = await mockDataService.GetEquipmentByTypeAsync(equipType);
            return Results.Ok(equipment);
        })
        .WithName("GetMockEquipmentByType")
        .WithSummary("Get equipment by type");

        group.MapGet("/equipment/test/{testId:int}", async (int testId, IMockDataService mockDataService) =>
        {
            var equipment = await mockDataService.GetEquipmentForTestAsync(testId);
            return Results.Ok(equipment);
        })
        .WithName("GetMockEquipmentForTest")
        .WithSummary("Get equipment for a specific test");

        group.MapGet("/equipment/type/{equipType}/test/{testId:int}", async (string equipType, int testId, IMockDataService mockDataService) =>
        {
            var equipment = await mockDataService.GetEquipmentByTypeAndTestAsync(equipType, testId);
            return Results.Ok(equipment);
        })
        .WithName("GetMockEquipmentByTypeAndTest")
        .WithSummary("Get equipment by type and test");

        group.MapGet("/equipment/id/{id:int}", async (int id, IMockDataService mockDataService) =>
        {
            var equipment = await mockDataService.GetEquipmentByIdAsync(id);
            if (equipment == null)
                return Results.NotFound();
            return Results.Ok(equipment);
        })
        .WithName("GetMockEquipmentById")
        .WithSummary("Get equipment by ID");

        group.MapGet("/equipment/name/{equipName}", async (string equipName, IMockDataService mockDataService) =>
        {
            var equipment = await mockDataService.GetEquipmentByNameAsync(equipName);
            if (equipment == null)
                return Results.NotFound();
            return Results.Ok(equipment);
        })
        .WithName("GetMockEquipmentByName")
        .WithSummary("Get equipment by name");

        group.MapGet("/equipment/types", async (IMockDataService mockDataService) =>
        {
            var types = await mockDataService.GetEquipmentTypesAsync();
            return Results.Ok(types);
        })
        .WithName("GetMockEquipmentTypes")
        .WithSummary("Get all equipment types");

        group.MapGet("/equipment/types/test/{testId:int}", async (int testId, IMockDataService mockDataService) =>
        {
            var types = await mockDataService.GetEquipmentTypesForTestAsync(testId);
            return Results.Ok(types);
        })
        .WithName("GetMockEquipmentTypesForTest")
        .WithSummary("Get equipment types for a specific test");

        group.MapGet("/equipment/overdue", async (IMockDataService mockDataService) =>
        {
            var equipment = await mockDataService.GetOverdueEquipmentAsync();
            return Results.Ok(equipment);
        })
        .WithName("GetMockOverdueEquipment")
        .WithSummary("Get overdue equipment");

        group.MapGet("/equipment/expiring/{days:int}", async (int days, IMockDataService mockDataService) =>
        {
            var equipment = await mockDataService.GetEquipmentExpiringWithinDaysAsync(days);
            return Results.Ok(equipment);
        })
        .WithName("GetMockEquipmentExpiringWithinDays")
        .WithSummary("Get equipment expiring within specified days");

        group.MapPost("/equipment", async (EquipmentDto equipment, IMockDataService mockDataService) =>
        {
            var newEquipment = await mockDataService.AddEquipmentAsync(equipment);
            return Results.Created($"/api/mock/equipment/id/{newEquipment.Id}", newEquipment);
        })
        .WithName("AddMockEquipment")
        .WithSummary("Add new equipment");

        group.MapPut("/equipment/{id:int}", async (int id, EquipmentDto updates, IMockDataService mockDataService) =>
        {
            var updatedEquipment = await mockDataService.UpdateEquipmentAsync(id, updates);
            if (updatedEquipment == null)
                return Results.NotFound();
            return Results.Ok(updatedEquipment);
        })
        .WithName("UpdateMockEquipment")
        .WithSummary("Update equipment");

        group.MapDelete("/equipment/{id:int}", async (int id, IMockDataService mockDataService) =>
        {
            var success = await mockDataService.DeleteEquipmentAsync(id);
            if (!success)
                return Results.NotFound();
            return Results.NoContent();
        })
        .WithName("DeleteMockEquipment")
        .WithSummary("Delete equipment");

        group.MapGet("/equipment/viscometer/{equipName}/calibration", async (string equipName, IMockDataService mockDataService) =>
        {
            var calibration = await mockDataService.GetViscometerCalibrationAsync(equipName);
            if (calibration == null)
                return Results.NotFound();
            return Results.Ok(calibration);
        })
        .WithName("GetMockViscometerCalibration")
        .WithSummary("Get viscometer calibration data");

        group.MapGet("/equipment/{equipName}/suitable/{testId:int}", async (string equipName, int testId, IMockDataService mockDataService) =>
        {
            var isSuitable = await mockDataService.IsEquipmentSuitableForTestAsync(equipName, testId);
            return Results.Ok(new { isSuitable });
        })
        .WithName("IsEquipmentSuitableForTest")
        .WithSummary("Check if equipment is suitable for test");

        group.MapGet("/equipment/{equipName}/status", async (string equipName, IMockDataService mockDataService) =>
        {
            var status = await mockDataService.GetEquipmentStatusAsync(equipName);
            return Results.Ok(new { status });
        })
        .WithName("GetMockEquipmentStatus")
        .WithSummary("Get equipment status");

        group.MapGet("/equipment/{equipName}/suffix", async (string equipName, IMockDataService mockDataService) =>
        {
            var suffix = await mockDataService.GetEquipmentSuffixAsync(equipName);
            return Results.Ok(new { suffix });
        })
        .WithName("GetMockEquipmentSuffix")
        .WithSummary("Get equipment suffix for display");

        group.MapGet("/equipment/{equipName}/due-date-info", async (string equipName, IMockDataService mockDataService) =>
        {
            var info = await mockDataService.GetEquipmentWithDueDateInfoAsync(equipName);
            if (info == null)
                return Results.NotFound();
            return Results.Ok(info);
        })
        .WithName("GetMockEquipmentWithDueDateInfo")
        .WithSummary("Get equipment with due date information");

        group.MapGet("/equipment/usage-stats", async (IMockDataService mockDataService) =>
        {
            var stats = await mockDataService.GetEquipmentUsageStatsAsync();
            return Results.Ok(stats);
        })
        .WithName("GetMockEquipmentUsageStats")
        .WithSummary("Get equipment usage statistics");

        group.MapGet("/equipment/maintenance-schedule", async (IMockDataService mockDataService) =>
        {
            var schedule = await mockDataService.GetMaintenanceScheduleAsync();
            return Results.Ok(schedule);
        })
        .WithName("GetMockMaintenanceSchedule")
        .WithSummary("Get equipment maintenance schedule");

        group.MapGet("/equipment/{equipName}/validate/{testId:int}/{equipType}", async (string equipName, int testId, string equipType, IMockDataService mockDataService) =>
        {
            var validation = await mockDataService.ValidateEquipmentForTestAsync(equipName, testId, equipType);
            return Results.Ok(validation);
        })
        .WithName("MockValidateEquipmentForTest")
        .WithSummary("Validate equipment selection for a test");

        // User qualification endpoints
        group.MapGet("/qualifications/user/{userId}", async (string userId, IMockDataService mockDataService) =>
        {
            var qualifications = await mockDataService.GetUserQualificationsAsync(userId);
            return Results.Ok(qualifications);
        })
        .WithName("GetMockUserQualifications")
        .WithSummary("Get user qualifications for a specific user");

        group.MapGet("/qualifications/user/{userId}/test/{testId:int}", async (string userId, int testId, IMockDataService mockDataService) =>
        {
            var qualification = await mockDataService.IsUserQualifiedAsync(userId, testId);
            return Results.Ok(new { qualification });
        })
        .WithName("IsUserQualified")
        .WithSummary("Check if user is qualified for a specific test");

        group.MapGet("/qualifications/user/{userId}/test/{testId:int}/review", async (string userId, int testId, IMockDataService mockDataService) =>
        {
            var qualification = await mockDataService.IsUserQualifiedToReviewAsync(userId, testId);
            return Results.Ok(new { qualification });
        })
        .WithName("IsUserQualifiedToReview")
        .WithSummary("Check if user is qualified to review results for a specific test");

        group.MapGet("/qualifications/user/{userId}/test/{testId:int}/action/{action}", async (string userId, int testId, string action, IMockDataService mockDataService) =>
        {
            var canPerform = await mockDataService.CanUserPerformActionAsync(userId, testId, action);
            return Results.Ok(new { canPerform });
        })
        .WithName("MockCanUserPerformAction")
        .WithSummary("Check if user can perform a specific action");

        group.MapGet("/qualifications/test-stands", async (IMockDataService mockDataService) =>
        {
            var testStands = await mockDataService.GetTestStandsAsync();
            return Results.Ok(testStands);
        })
        .WithName("GetMockTestStands")
        .WithSummary("Get all test stands");

        group.MapGet("/qualifications/levels", async (IMockDataService mockDataService) =>
        {
            var levels = await mockDataService.GetQualificationLevelsAsync();
            return Results.Ok(levels);
        })
        .WithName("GetMockQualificationLevels")
        .WithSummary("Get all qualification levels");

        group.MapPost("/qualifications", async (UserQualificationDto qualification, IMockDataService mockDataService) =>
        {
            var savedQualification = await mockDataService.SaveUserQualificationAsync(qualification);
            return Results.Created($"/api/mock/qualifications/user/{savedQualification.EmployeeId}", savedQualification);
        })
        .WithName("SaveMockUserQualification")
        .WithSummary("Add or update user qualification");

        group.MapDelete("/qualifications/user/{employeeId}/test-stand/{testStandId:int}", async (string employeeId, int testStandId, IMockDataService mockDataService) =>
        {
            var success = await mockDataService.RemoveUserQualificationAsync(employeeId, testStandId);
            if (!success)
                return Results.NotFound();
            return Results.NoContent();
        })
        .WithName("RemoveUserQualification")
        .WithSummary("Remove user qualification");

        group.MapGet("/qualifications/test/{testId:int}/level/{qualificationLevel}", async (int testId, string qualificationLevel, IMockDataService mockDataService) =>
        {
            var users = await mockDataService.GetUsersByQualificationAsync(testId, qualificationLevel);
            return Results.Ok(users);
        })
        .WithName("GetMockUsersByQualification")
        .WithSummary("Get users by qualification level for a specific test");

        group.MapGet("/qualifications/user/{userId}/test/{testId:int}/can-enter", async (string userId, int testId, IMockDataService mockDataService) =>
        {
            var canEnter = await mockDataService.CanEnterResultsAsync(userId, testId);
            return Results.Ok(new { canEnter });
        })
        .WithName("MockCanEnterResults")
        .WithSummary("Check if user can enter results for a test");

        group.MapGet("/qualifications/user/{userId}/test/{testId:int}/can-review", async (string userId, int testId, IMockDataService mockDataService) =>
        {
            var canReview = await mockDataService.CanReviewResultsAsync(userId, testId);
            return Results.Ok(new { canReview });
        })
        .WithName("MockCanReviewResults")
        .WithSummary("Check if user can review results for a test");

        group.MapGet("/qualifications/user/{userId}/test/{testId:int}/can-accept", async (string userId, int testId, IMockDataService mockDataService) =>
        {
            var canAccept = await mockDataService.CanAcceptResultsAsync(userId, testId);
            return Results.Ok(new { canAccept });
        })
        .WithName("MockCanAcceptResults")
        .WithSummary("Check if user can accept results for a test");

        group.MapGet("/qualifications/user/{userId}/test/{testId:int}/can-reject", async (string userId, int testId, IMockDataService mockDataService) =>
        {
            var canReject = await mockDataService.CanRejectResultsAsync(userId, testId);
            return Results.Ok(new { canReject });
        })
        .WithName("MockCanRejectResults")
        .WithSummary("Check if user can reject results for a test");

        group.MapGet("/qualifications/user/{userId}/test/{testId:int}/can-delete", async (string userId, int testId, IMockDataService mockDataService) =>
        {
            var canDelete = await mockDataService.CanDeleteResultsAsync(userId, testId);
            return Results.Ok(new { canDelete });
        })
        .WithName("MockCanDeleteResults")
        .WithSummary("Check if user can delete results for a test");

        group.MapGet("/qualifications/user/{userId}/test/{testId:int}/can-partial-save", async (string userId, int testId, IMockDataService mockDataService) =>
        {
            var canPartialSave = await mockDataService.CanPartialSaveAsync(userId, testId);
            return Results.Ok(new { canPartialSave });
        })
        .WithName("MockCanPartialSave")
        .WithSummary("Check if user can perform partial saves for a test");

        group.MapGet("/qualifications/user/{userId}/microscopy-permissions", async (string userId, IMockDataService mockDataService) =>
        {
            var hasPermissions = await mockDataService.HasMicroscopyPermissionsAsync(userId);
            return Results.Ok(new { hasPermissions });
        })
        .WithName("HasMicroscopyPermissions")
        .WithSummary("Check if user has microscopy permissions");

        group.MapGet("/qualifications/user/{userId}/highest-level", async (string userId, IMockDataService mockDataService) =>
        {
            var level = await mockDataService.GetHighestQualificationLevelAsync(userId);
            return Results.Ok(new { level });
        })
        .WithName("GetMockHighestQualificationLevel")
        .WithSummary("Get the highest qualification level for a user across all test stands");

        group.MapGet("/qualifications/user/{userId}/is-supervisor", async (string userId, IMockDataService mockDataService) =>
        {
            var isSupervisor = await mockDataService.IsSupervisorAsync(userId);
            return Results.Ok(new { isSupervisor });
        })
        .WithName("IsSupervisor")
        .WithSummary("Check if user is a supervisor");

        group.MapGet("/qualifications/supervisors", async (IMockDataService mockDataService) =>
        {
            var supervisors = await mockDataService.GetSupervisorsAsync();
            return Results.Ok(supervisors);
        })
        .WithName("GetMockSupervisors")
        .WithSummary("Get all users with supervisor privileges");

        // Status management endpoints
        group.MapGet("/statuses", async (IMockDataService mockDataService) =>
        {
            var statuses = await mockDataService.GetAllStatusesAsync();
            return Results.Ok(statuses);
        })
        .WithName("GetMockAllStatuses")
        .WithSummary("Get all test statuses");

        group.MapGet("/statuses/{code}", async (string code, IMockDataService mockDataService) =>
        {
            var status = await mockDataService.GetStatusByCodeAsync(code);
            if (status == null)
                return Results.NotFound();
            return Results.Ok(status);
        })
        .WithName("GetMockStatusByCode")
        .WithSummary("Get status by code");

        group.MapGet("/statuses/test/{testId:int}/workflow", async (int testId, IMockDataService mockDataService) =>
        {
            var workflow = await mockDataService.GetTestWorkflowAsync(testId);
            if (workflow == null)
                return Results.NotFound();
            return Results.Ok(workflow);
        })
        .WithName("GetMockTestWorkflow")
        .WithSummary("Get workflow for a specific test");

        group.MapGet("/statuses/transition/{fromStatus}/{toStatus}/test/{testId:int}", async (string fromStatus, string toStatus, int testId, IMockDataService mockDataService) =>
        {
            var transition = await mockDataService.IsStatusTransitionAllowedAsync(fromStatus, toStatus, testId);
            return Results.Ok(transition);
        })
        .WithName("IsStatusTransitionAllowed")
        .WithSummary("Check if status transition is allowed");

        group.MapGet("/statuses/{currentStatus}/next/test/{testId:int}", async (string currentStatus, int testId, IMockDataService mockDataService) =>
        {
            var nextStatuses = await mockDataService.GetNextPossibleStatusesAsync(currentStatus, testId);
            return Results.Ok(nextStatuses);
        })
        .WithName("GetMockNextPossibleStatuses")
        .WithSummary("Get next possible statuses for a given status and test");

        group.MapGet("/statuses/{status}/requires-review", async (string status, IMockDataService mockDataService) =>
        {
            var requiresReview = await mockDataService.RequiresReviewAsync(status);
            return Results.Ok(new { requiresReview });
        })
        .WithName("RequiresReview")
        .WithSummary("Check if test requires review at current status");

        group.MapGet("/statuses/{status}/is-final", async (string status, IMockDataService mockDataService) =>
        {
            var isFinal = await mockDataService.IsFinalStatusAsync(status);
            return Results.Ok(new { isFinal });
        })
        .WithName("IsFinalStatus")
        .WithSummary("Check if status is final");

        group.MapGet("/statuses/{status}/color", async (string status, IMockDataService mockDataService) =>
        {
            var color = await mockDataService.GetStatusColorAsync(status);
            return Results.Ok(new { color });
        })
        .WithName("GetMockStatusColor")
        .WithSummary("Get status color for display");

        group.MapGet("/statuses/{status}/description", async (string status, IMockDataService mockDataService) =>
        {
            var description = await mockDataService.GetStatusDescriptionAsync(status);
            return Results.Ok(new { description });
        })
        .WithName("GetMockStatusDescription")
        .WithSummary("Get status description");

        group.MapGet("/statuses/test/{testId:int}/partial-save-allowed", async (int testId, IMockDataService mockDataService) =>
        {
            var allowed = await mockDataService.IsPartialSaveAllowedAsync(testId);
            return Results.Ok(new { allowed });
        })
        .WithName("IsPartialSaveAllowed")
        .WithSummary("Check if partial save is allowed for a test");

        group.MapGet("/statuses/test/{testId:int}/delete-allowed", async (int testId, IMockDataService mockDataService) =>
        {
            var allowed = await mockDataService.IsDeleteAllowedAsync(testId);
            return Results.Ok(new { allowed });
        })
        .WithName("IsDeleteAllowed")
        .WithSummary("Check if delete is allowed for a test");

        group.MapGet("/statuses/test/{testId:int}/review-required", async (int testId, IMockDataService mockDataService) =>
        {
            var required = await mockDataService.IsReviewRequiredAsync(testId);
            return Results.Ok(new { required });
        })
        .WithName("IsReviewRequired")
        .WithSummary("Check if review is required for a test");

        group.MapGet("/statuses/test/{testId:int}/partial-save-status/{userQualification}", async (int testId, string userQualification, IMockDataService mockDataService) =>
        {
            var status = await mockDataService.GetPartialSaveStatusAsync(testId, userQualification);
            return Results.Ok(new { status });
        })
        .WithName("GetMockPartialSaveStatus")
        .WithSummary("Get appropriate status for partial save");

        group.MapGet("/statuses/test/{testId:int}/full-save-status/{userQualification}", async (int testId, string userQualification, IMockDataService mockDataService) =>
        {
            var status = await mockDataService.GetFullSaveStatusAsync(testId, userQualification);
            return Results.Ok(new { status });
        })
        .WithName("GetMockFullSaveStatus")
        .WithSummary("Get appropriate status for full save");

        group.MapGet("/statuses/test/{testId:int}/media-ready-status", async (int testId, IMockDataService mockDataService) =>
        {
            var status = await mockDataService.GetMediaReadyStatusAsync(testId);
            return Results.Ok(new { status });
        })
        .WithName("GetMockMediaReadyStatus")
        .WithSummary("Get appropriate status for media ready");

        group.MapGet("/statuses/training-status", async (IMockDataService mockDataService) =>
        {
            var status = await mockDataService.GetTrainingStatusAsync();
            return Results.Ok(new { status });
        })
        .WithName("GetMockTrainingStatus")
        .WithSummary("Get appropriate status for training");

        group.MapGet("/statuses/validation-status", async (IMockDataService mockDataService) =>
        {
            var status = await mockDataService.GetValidationStatusAsync();
            return Results.Ok(new { status });
        })
        .WithName("GetMockValidationStatus")
        .WithSummary("Get appropriate status for validation");

        group.MapGet("/statuses/cancellation-status", async (IMockDataService mockDataService) =>
        {
            var status = await mockDataService.GetCancellationStatusAsync();
            return Results.Ok(new { status });
        })
        .WithName("GetMockCancellationStatus")
        .WithSummary("Get appropriate status for cancellation");

        group.MapGet("/statuses/action/{action}/current/{currentStatus}/test/{testId:int}/qualification/{userQualification}", async (string action, string currentStatus, int testId, string userQualification, IMockDataService mockDataService) =>
        {
            var canPerform = await mockDataService.CanPerformActionAsync(action, currentStatus, testId, userQualification);
            return Results.Ok(new { canPerform });
        })
        .WithName("MockCanPerformAction")
        .WithSummary("Check if user can perform action based on status and qualification");

        group.MapGet("/statuses/test/{testId:int}/workflow-display", async (int testId, IMockDataService mockDataService) =>
        {
            var workflow = await mockDataService.GetStatusWorkflowForDisplayAsync(testId);
            return Results.Ok(workflow);
        })
        .WithName("GetMockStatusWorkflowForDisplay")
        .WithSummary("Get status workflow for display");

        group.MapGet("/statuses/test/{testId:int}/statistics", async (int testId, IMockDataService mockDataService) =>
        {
            var stats = await mockDataService.GetStatusStatisticsAsync(testId);
            return Results.Ok(stats);
        })
        .WithName("GetMockStatusStatistics")
        .WithSummary("Get status statistics for a test");

        group.MapGet("/statuses/overdue-tests", async (IMockDataService mockDataService) =>
        {
            var overdueTests = await mockDataService.GetOverdueTestsAsync();
            return Results.Ok(overdueTests);
        })
        .WithName("GetMockOverdueTests")
        .WithSummary("Get overdue tests");

        group.MapGet("/statuses/pending-review", async (IMockDataService mockDataService) =>
        {
            var pendingTests = await mockDataService.GetTestsPendingReviewAsync();
            return Results.Ok(pendingTests);
        })
        .WithName("GetMockTestsPendingReview")
        .WithSummary("Get tests pending review");
    }
}
