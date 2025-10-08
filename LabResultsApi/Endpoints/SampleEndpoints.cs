using LabResultsApi.DTOs;
using LabResultsApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace LabResultsApi.Endpoints;

public static class SampleEndpoints
{
    public static void MapSampleEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/samples")
            .WithTags("Samples")
;

        // Get sample information
        group.MapGet("/{sampleId:int}", 
            async (int sampleId, [FromServices] ITestResultService service) =>
            {
                var sample = await service.GetSampleInfoAsync(sampleId);
                if (sample == null)
                    return Results.NotFound($"Sample with ID {sampleId} not found");
                
                return Results.Ok(sample);
            })
            .WithName("GetSampleInfo")
            .WithSummary("Get sample information")
            .WithDescription("Retrieves detailed information about a specific sample")
            .Produces<SampleInfoDto>(200)
            .Produces(404)
            .Produces(500);
    }
}
