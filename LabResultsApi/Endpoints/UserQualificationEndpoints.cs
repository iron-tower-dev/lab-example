using LabResultsApi.DTOs;
using LabResultsApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace LabResultsApi.Endpoints;

public static class UserQualificationEndpoints
{
    public static void MapUserQualificationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/user-qualifications")
            .WithTags("User Qualifications")
;

        // Get user qualification for a specific test
        group.MapGet("/{userId}/{testId:int}", 
            async (string userId, short testId, IUserQualificationService service) =>
            {
                var qualification = await service.GetUserQualificationAsync(userId, testId);
                if (qualification == null)
                    return Results.NotFound($"Qualification not found for user {userId} and test {testId}");
                
                return Results.Ok(qualification);
            })
            .WithName("GetUserQualification")
            .WithSummary("Get user qualification for a test")
            .WithDescription("Retrieves user qualification information for a specific test")
            .Produces<UserQualificationDto>(200)
            .Produces(404)
            .Produces(500);

        // Get user qualification summary
        group.MapGet("/{userId}/summary", 
            async (string userId, IUserQualificationService service) =>
            {
                var summary = await service.GetUserQualificationSummaryAsync(userId);
                return Results.Ok(summary);
            })
            .WithName("GetUserQualificationSummary")
            .WithSummary("Get user qualification summary")
            .WithDescription("Retrieves a summary of all user qualifications")
            .Produces<object>(200)
            .Produces(500);

        // Get qualified tests for user
        group.MapGet("/{userId}/qualified-tests", 
            async (string userId, IUserQualificationService service) =>
            {
                var tests = await service.GetQualifiedTestsForUserAsync(userId);
                return Results.Ok(tests);
            })
            .WithName("GetQualifiedTestsForUser")
            .WithSummary("Get qualified tests for user")
            .WithDescription("Retrieves all tests that the user is qualified to perform")
            .Produces<List<TestInfoDto>>(200)
            .Produces(500);

        // Get unqualified tests for user
        group.MapGet("/{userId}/unqualified-tests", 
            async (string userId, IUserQualificationService service) =>
            {
                var tests = await service.GetUnqualifiedTestsForUserAsync(userId);
                return Results.Ok(tests);
            })
            .WithName("GetUnqualifiedTestsForUser")
            .WithSummary("Get unqualified tests for user")
            .WithDescription("Retrieves all tests that the user is not qualified to perform")
            .Produces<List<TestInfoDto>>(200)
            .Produces(500);

        // Check if user can perform action
        group.MapGet("/{userId}/{testId:int}/can-perform/{action}", 
            async (string userId, short testId, string action, IUserQualificationService service) =>
            {
                var canPerform = await service.CanUserPerformActionAsync(userId, testId, action);
                return Results.Ok(new { CanPerform = canPerform });
            })
            .WithName("CanUserPerformAction")
            .WithSummary("Check if user can perform action")
            .WithDescription("Checks if a user can perform a specific action on a test")
            .Produces<object>(200)
            .Produces(500);

        // Get test stand qualifications
        group.MapGet("/test-stand/{testStandId:int}", 
            async (short testStandId, IUserQualificationService service) =>
            {
                var qualifications = await service.GetTestStandQualificationsAsync(testStandId);
                return Results.Ok(qualifications);
            })
            .WithName("GetTestStandQualifications")
            .WithSummary("Get test stand qualifications")
            .WithDescription("Retrieves all qualifications for a specific test stand")
            .Produces<List<UserQualificationDto>>(200)
            .Produces(500);

        // Get user test stand mappings
        group.MapGet("/{userId}/test-stands", 
            async (string userId, IUserQualificationService service) =>
            {
                var mappings = await service.GetUserTestStandMappingsAsync(userId);
                return Results.Ok(mappings);
            })
            .WithName("GetUserTestStandMappings")
            .WithSummary("Get user test stand mappings")
            .WithDescription("Retrieves all test stand mappings for a user")
            .Produces<List<object>>(200)
            .Produces(500);
    }
}
