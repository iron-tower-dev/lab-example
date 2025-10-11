using LabResultsApi.DTOs;
using LabResultsApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace LabResultsApi.Endpoints;

public static class ParticleAnalysisEndpoints
{
    public static void MapParticleAnalysisEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/particle-analysis")
            .WithTags("Particle Analysis")
;

        // Get particle type categories
        group.MapGet("/categories", 
            async (IParticleAnalysisService service) =>
            {
                var categories = await service.GetParticleTypeCategoriesAsync();
                return Results.Ok(categories);
            })
            .WithName("GetParticleTypeCategories")
            .WithSummary("Get particle type categories")
            .WithDescription("Retrieves all particle type categories with subtype counts")
            .Produces<List<ParticleTypeCategoryDto>>(200)
            .Produces(500);

        // Get particle sub type definitions
        group.MapGet("/subtypes", 
            async (IParticleAnalysisService service) =>
            {
                var subTypes = await service.GetParticleSubTypeDefinitionsAsync();
                return Results.Ok(subTypes);
            })
            .WithName("GetParticleSubTypeDefinitions")
            .WithSummary("Get particle sub type definitions")
            .WithDescription("Retrieves all particle sub type definitions")
            .Produces<List<ParticleSubTypeDefinitionDto>>(200)
            .Produces(500);

        // Get particle types for a specific sample and test
        group.MapGet("/{sampleId:int}/{testId:int}", 
            async (int sampleId, short testId, [FromServices] IParticleAnalysisService service) =>
            {
                var particleTypes = await service.GetParticleTypesAsync(sampleId, testId);
                return Results.Ok(particleTypes);
            })
            .WithName("GetParticleTypes")
            .WithSummary("Get particle types for sample and test")
            .WithDescription("Retrieves all particle types for a specific sample and test")
            .Produces<List<ParticleTypeDto>>(200)
            .Produces(500);

        // Save particle types for a specific sample and test
        group.MapPost("/{sampleId:int}/{testId:int}", 
            async (int sampleId, short testId, List<ParticleTypeDto> particleTypes, [FromServices] IParticleAnalysisService service) =>
            {
                var result = await service.SaveParticleTypesAsync(sampleId, testId, particleTypes);
                return Results.Ok(result);
            })
            .WithName("SaveParticleTypes")
            .WithSummary("Save particle types for sample and test")
            .WithDescription("Saves particle types for a specific sample and test")
            .Produces<bool>(200)
            .Produces(400)
            .Produces(500);

        // Get particle analysis for a specific sample and test
        group.MapGet("/analysis/{sampleId:int}/{testId:int}", 
            async (int sampleId, short testId, [FromServices] IParticleAnalysisService service) =>
            {
                var analysis = await service.GetParticleAnalysisAsync(sampleId, testId);
                return Results.Ok(analysis);
            })
            .WithName("GetParticleAnalysis")
            .WithSummary("Get particle analysis")
            .WithDescription("Retrieves comprehensive particle analysis for a specific sample and test")
            .Produces<ParticleAnalysisDto>(200)
            .Produces(500);

        // Save particle analysis
        group.MapPost("/analysis", 
            async (ParticleAnalysisDto dto, IParticleAnalysisService service) =>
            {
                var result = await service.SaveParticleAnalysisAsync(dto);
                return Results.Ok(result);
            })
            .WithName("SaveParticleAnalysis")
            .WithSummary("Save particle analysis")
            .WithDescription("Saves comprehensive particle analysis data")
            .Produces<ParticleAnalysisDto>(200)
            .Produces(400)
            .Produces(500);
    }
}
