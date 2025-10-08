using Microsoft.AspNetCore.Mvc;
using LabResultsApi.DTOs;
using LabResultsApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace LabResultsApi.Endpoints;

public static class TestResultsEndpoints
{
    public static void MapTestResultsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/test-results")
            .WithTags("Test Results")
;

        // Get test results for a specific sample and test
        group.MapGet("/{sampleId:int}/{testId:short}", 
            async (int sampleId, short testId, ITestResultService service) =>
            {
                var results = await service.GetTestResultsAsync(sampleId, testId);
                return Results.Ok(results);
            })
            .WithName("GetTestResults")
            .WithSummary("Get test results for a specific sample and test")
            .WithDescription("Retrieves all test results for a given sample ID and test ID")
            .Produces<List<TestResultEntryDto>>(200)
            .Produces(404)
            .Produces(500);

        // Save test results
        group.MapPost("/", 
            async (TestResultSaveDto dto, ITestResultService service, HttpContext context) =>
            {
                // Get employee ID from headers (in real app, this would come from authentication)
                var employeeId = context.Request.Headers["X-Employee-Id"].FirstOrDefault() ?? "TEST001";
                
                var result = await service.SaveTestResultsAsync(dto, employeeId);
                return Results.Ok(result);
            })
            .WithName("SaveTestResults")
            .WithSummary("Save test results")
            .WithDescription("Saves test result entries")
            .Produces<TestResultResponseDto>(200)
            .Produces(400)
            .Produces(500);

        // Update test result
        group.MapPut("/{sampleId:int}/{testId:short}", 
            async (int sampleId, short testId, TestResultEntryDto dto, ITestResultService service) =>
            {
                var result = await service.UpdateTestResultAsync(sampleId, testId, dto);
                return Results.Ok(result);
            })
            .WithName("UpdateTestResult")
            .WithSummary("Update a test result")
            .WithDescription("Updates an existing test result for a specific sample and test")
            .Produces<TestResultEntryDto>(200)
            .Produces(400)
            .Produces(404)
            .Produces(500);

        // Delete test result
        group.MapDelete("/{sampleId:int}/{testId:short}", 
            async (int sampleId, short testId, ITestResultService service) =>
            {
                await service.DeleteTestResultAsync(sampleId, testId);
                return Results.NoContent();
            })
            .WithName("DeleteTestResult")
            .WithSummary("Delete a test result")
            .WithDescription("Deletes a test result for a specific sample and test")
            .Produces(204)
            .Produces(404)
            .Produces(500);


        // Get tests pending review for a user
        group.MapGet("/pending-review/{userId}", 
            async (string userId, ITestResultService service) =>
            {
                var results = await service.GetTestsPendingReviewForUserAsync(userId);
                return Results.Ok(results);
            })
            .WithName("GetTestsPendingReview")
            .WithSummary("Get tests pending review for a user")
            .WithDescription("Retrieves all tests that are pending review for a specific user")
            .Produces<List<TestResultEntryDto>>(200)
            .Produces(500);
    }
}
