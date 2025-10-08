using LabResultsApi.DTOs;
using LabResultsApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc;

namespace LabResultsApi.Endpoints;

public static class EquipmentEndpoints
{
    public static void MapEquipmentEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/equipment")
            .WithTags("Equipment")
;

        // Get equipment by type
        group.MapGet("/{equipmentType}", 
            async (string equipmentType, [FromQuery] short? testId, IEquipmentService service) =>
            {
                var equipment = await service.GetEquipmentByTypeAsync(equipmentType, testId);
                return Results.Ok(equipment);
            })
            .WithName("GetEquipmentByType")
            .WithSummary("Get equipment by type")
            .WithDescription("Retrieves equipment filtered by type and optionally by test ID")
            .Produces<List<EquipmentDto>>(200)
            .Produces(500);

        // Get equipment for a specific test
        group.MapGet("/test/{testId:short}", 
            async (short testId, IEquipmentService service) =>
            {
                var equipment = await service.GetEquipmentForTestAsync(testId);
                return Results.Ok(equipment);
            })
            .WithName("GetEquipmentForTest")
            .WithSummary("Get equipment for test")
            .WithDescription("Retrieves all equipment available for a specific test")
            .Produces<List<EquipmentDto>>(200)
            .Produces(500);

        // Get viscometers for specific lube type and test
        group.MapGet("/viscometers", 
            async ([FromQuery] string lubeType, [FromQuery] short testId, IEquipmentService service) =>
            {
                var viscometers = await service.GetViscometersAsync(lubeType, testId);
                return Results.Ok(viscometers);
            })
            .WithName("GetViscometers")
            .WithSummary("Get viscometers for lube type and test")
            .WithDescription("Retrieves viscometers suitable for a specific lubricant type and test")
            .Produces<List<EquipmentDto>>(200)
            .Produces(500);

        // Get comments by area
        group.MapGet("/comments/{area}", 
            async (string area, IEquipmentService service) =>
            {
                var comments = await service.GetCommentsByAreaAsync(area);
                return Results.Ok(comments);
            })
            .WithName("GetCommentsByArea")
            .WithSummary("Get comments by area")
            .WithDescription("Retrieves comments filtered by area")
            .Produces<List<EquipmentDto>>(200)
            .Produces(500);

        // Get overdue equipment
        group.MapGet("/overdue", 
            async (IEquipmentService service) =>
            {
                var overdueEquipment = await service.GetOverdueEquipmentAsync();
                return Results.Ok(overdueEquipment);
            })
            .WithName("GetOverdueEquipment")
            .WithSummary("Get overdue equipment")
            .WithDescription("Retrieves all equipment that is overdue for calibration or maintenance")
            .Produces<List<EquipmentDto>>(200)
            .Produces(500);

        // Validate equipment selection
        group.MapPost("/validate", 
            async (EquipmentValidationDto dto, IEquipmentService service) =>
            {
                var result = await service.ValidateEquipmentSelectionAsync(dto.EquipmentId, dto.TestId);
                return Results.Ok(result);
            })
            .WithName("ValidateEquipmentSelection")
            .WithSummary("Validate equipment selection")
            .WithDescription("Validates if selected equipment is suitable for the specified test")
            .Produces<object>(200)
            .Produces(400)
            .Produces(500);
    }
}

public class EquipmentValidationDto
{
    public int EquipmentId { get; set; }
    public short TestId { get; set; }
}
