using LabResultsApi.DTOs;
using LabResultsApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace LabResultsApi.Endpoints;

public static class StatusManagementEndpoints
{
    public static void MapStatusManagementEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/status")
            .WithTags("Status Management")
;

        // Get test status
        group.MapGet("/test/{sampleId:int}/{testId:int}", 
            async (int sampleId, short testId, [FromServices] ITestResultService service) =>
            {
                var status = await service.GetTestStatusAsync(sampleId, testId);
                return Results.Ok(status);
            })
            .WithName("GetTestStatus")
            .WithSummary("Get test status")
            .WithDescription("Retrieves the current status of a test for a specific sample")
            .Produces<object>(200)
            .Produces(500);

        // Update test status
        group.MapPut("/test", 
            async (TestStatusUpdateDto dto, ITestResultService service) =>
            {
                var result = await service.UpdateTestStatusAsync(dto);
                return Results.Ok(result);
            })
            .WithName("UpdateTestStatus")
            .WithSummary("Update test status")
            .WithDescription("Updates the status of a test with optional comments")
            .Produces<bool>(200)
            .Produces(400)
            .Produces(500);

        // Get test workflow
        group.MapGet("/workflow/{testId:int}", 
            async (short testId, ITestResultService service) =>
            {
                var workflow = await service.GetTestWorkflowAsync(testId);
                return Results.Ok(workflow);
            })
            .WithName("GetTestWorkflow")
            .WithSummary("Get test workflow")
            .WithDescription("Retrieves the workflow information for a specific test")
            .Produces<object>(200)
            .Produces(500);

        // Get save status
        group.MapGet("/save/{sampleId:int}/{testId:int}", 
            async (int sampleId, short testId, [FromServices] ITestResultService service) =>
            {
                var status = await service.GetSaveStatusAsync(sampleId, testId);
                return Results.Ok(status);
            })
            .WithName("GetSaveStatus")
            .WithSummary("Get save status")
            .WithDescription("Retrieves the save status for a test result")
            .Produces<object>(200)
            .Produces(500);
    }
}

