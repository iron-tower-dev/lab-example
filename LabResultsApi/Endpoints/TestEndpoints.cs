using LabResultsApi.DTOs;
using LabResultsApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace LabResultsApi.Endpoints;

public static class TestEndpoints
{
    public static void MapTestEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/tests")
            .WithTags("Tests")
;

        // Get test information
        group.MapGet("/{testId:short}", 
            async (short testId, ITestResultService service) =>
            {
                var testInfo = await service.GetTestInfoAsync(testId);
                if (testInfo == null)
                    return Results.NotFound($"Test with ID {testId} not found");
                
                return Results.Ok(testInfo);
            })
            .WithName("GetTestInfo")
            .WithSummary("Get test information")
            .WithDescription("Retrieves detailed information about a specific test")
            .Produces<TestInfoDto>(200)
            .Produces(404)
            .Produces(500);

        // Get comprehensive test information
        group.MapGet("/{testId:short}/comprehensive", 
            async (short testId, ITestResultService service) =>
            {
                var testInfo = await service.GetComprehensiveTestInfoAsync(testId);
                if (testInfo == null)
                    return Results.NotFound($"Test with ID {testId} not found");
                
                return Results.Ok(testInfo);
            })
            .WithName("GetComprehensiveTestInfo")
            .WithSummary("Get comprehensive test information")
            .WithDescription("Retrieves comprehensive test information including requirements and equipment")
            .Produces<object>(200)
            .Produces(404)
            .Produces(500);

        // TAN Test endpoints
        group.MapPost("/tan", 
            async (TanTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveTanTestAsync(dto);
                return Results.Ok(result);
            })
            .WithName("SaveTanTest")
            .WithSummary("Save TAN test results")
            .WithDescription("Saves Total Acid Number test results")
            .Produces<TanTestDto>(200)
            .Produces(400)
            .Produces(500);

        // Emission Spectro Test endpoints
        group.MapPost("/emission-spectro", 
            async (EmissionSpectroDto dto, ITestResultService service) =>
            {
                var result = await service.SaveEmissionSpectroTestAsync(dto);
                return Results.Ok(result);
            })
            .WithName("SaveEmissionSpectroTest")
            .WithSummary("Save Emission Spectro test results")
            .WithDescription("Saves Emission Spectrometry test results")
            .Produces<EmissionSpectroDto>(200)
            .Produces(400)
            .Produces(500);

        // Viscosity Test endpoints
        group.MapPost("/viscosity", 
            async (ViscosityTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveViscosityTestAsync(dto);
                return Results.Ok(result);
            })
            .WithName("SaveViscosityTest")
            .WithSummary("Save Viscosity test results")
            .WithDescription("Saves Viscosity test results")
            .Produces<ViscosityTestDto>(200)
            .Produces(400)
            .Produces(500);

        // FTIR Test endpoints
        group.MapPost("/ftir", 
            async (FtirTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveFtirTestAsync(dto);
                return Results.Ok(result);
            })
            .WithName("SaveFtirTest")
            .WithSummary("Save FTIR test results")
            .WithDescription("Saves Fourier Transform Infrared Spectroscopy test results")
            .Produces<FtirTestDto>(200)
            .Produces(400)
            .Produces(500);

        // Flash Point Test endpoints
        group.MapPost("/flash-point", 
            async (FlashPointTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveFlashPointTestAsync(dto);
                return Results.Ok(result);
            })
            .WithName("SaveFlashPointTest")
            .WithSummary("Save Flash Point test results")
            .WithDescription("Saves Flash Point test results")
            .Produces<FlashPointTestDto>(200)
            .Produces(400)
            .Produces(500);

        // Particle Count Test endpoints
        group.MapPost("/particle-count", 
            async (ParticleCountTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveParticleCountTestAsync(dto);
                return Results.Ok(result);
            })
            .WithName("SaveParticleCountTest")
            .WithSummary("Save Particle Count test results")
            .WithDescription("Saves Particle Count test results")
            .Produces<ParticleCountTestDto>(200)
            .Produces(400)
            .Produces(500);

        // Grease Penetration Test endpoints
        group.MapPost("/grease-penetration", 
            async (GreasePenetrationTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveGreasePenetrationTestAsync(dto);
                return Results.Ok(result);
            })
            .WithName("SaveGreasePenetrationTest")
            .WithSummary("Save Grease Penetration test results")
            .WithDescription("Saves Grease Penetration Worked test results")
            .Produces<GreasePenetrationTestDto>(200)
            .Produces(400)
            .Produces(500);

        // Dropping Point Test endpoints
        group.MapPost("/dropping-point", 
            async (DroppingPointTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveDroppingPointTestAsync(dto);
                return Results.Ok(result);
            })
            .WithName("SaveDroppingPointTest")
            .WithSummary("Save Dropping Point test results")
            .WithDescription("Saves Grease Dropping Point test results")
            .Produces<DroppingPointTestDto>(200)
            .Produces(400)
            .Produces(500);

        // RBOT Test endpoints
        group.MapPost("/rbot", 
            async (RbotTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveRbotTestAsync(dto);
                return Results.Ok(result);
            })
            .WithName("SaveRbotTest")
            .WithSummary("Save RBOT test results")
            .WithDescription("Saves Rotary Bomb Oxidation Test results")
            .Produces<RbotTestDto>(200)
            .Produces(400)
            .Produces(500);

        // Oxidation Stability Test endpoints
        group.MapPost("/oxidation-stability", 
            async (OxidationStabilityTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveOxidationStabilityTestAsync(dto);
                return Results.Ok(result);
            })
            .WithName("SaveOxidationStabilityTest")
            .WithSummary("Save Oxidation Stability test results")
            .WithDescription("Saves Oxidation Stability test results")
            .Produces<OxidationStabilityTestDto>(200)
            .Produces(400)
            .Produces(500);

        // Deleterious Test endpoints
        group.MapPost("/deleterious", 
            async (DeleteriousTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveDeleteriousTestAsync(dto);
                return Results.Ok(result);
            })
            .WithName("SaveDeleteriousTest")
            .WithSummary("Save Deleterious test results")
            .WithDescription("Saves Deleterious test results")
            .Produces<DeleteriousTestDto>(200)
            .Produces(400)
            .Produces(500);

        // Rheometer Test endpoints
        group.MapPost("/rheometer", 
            async (RheometerTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveRheometerTestAsync(dto);
                return Results.Ok(result);
            })
            .WithName("SaveRheometerTest")
            .WithSummary("Save Rheometer test results")
            .WithDescription("Saves Rheometer test results")
            .Produces<RheometerTestDto>(200)
            .Produces(400)
            .Produces(500);

        // File Data Test endpoints
        group.MapPost("/file-data", 
            async (FileDataTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveFileDataTestAsync(dto);
                return Results.Ok(result);
            })
            .WithName("SaveFileDataTest")
            .WithSummary("Save File Data test results")
            .WithDescription("Saves File Data test results with file content")
            .Produces<FileDataTestDto>(200)
            .Produces(400)
            .Produces(500);

        // Simple Result Test (Test ID 110, 270)
        testSpecificGroup.MapPost("/simple-result", 
            async (SimpleResultTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveSimpleResultTestAsync(dto);
                return Results.Created($"/api/test-results/{result.SampleId}/{result.TestId}", result);
            })
            .WithName("SaveSimpleResultTest")
            .WithSummary("Save Simple Result test")
            .WithDescription("Saves Simple Result test results")
            .Produces<TestResultEntryDto>(201)
            .Produces(400);

        // Filter Inspection Test (Test ID 120)
        testSpecificGroup.MapPost("/filter-inspection", 
            async (FilterInspectionTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveFilterInspectionTestAsync(dto);
                return Results.Created($"/api/test-results/{result.SampleId}/{result.TestId}", result);
            })
            .WithName("SaveFilterInspectionTest")
            .WithSummary("Save Filter Inspection test")
            .WithDescription("Saves Filter Inspection test results")
            .Produces<TestResultEntryDto>(201)
            .Produces(400);

        // Filter Residue Test (Test ID 180)
        testSpecificGroup.MapPost("/filter-residue", 
            async (FilterResidueTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveFilterResidueTestAsync(dto);
                return Results.Created($"/api/test-results/{result.SampleId}/{result.TestId}", result);
            })
            .WithName("SaveFilterResidueTest")
            .WithSummary("Save Filter Residue test")
            .WithDescription("Saves Filter Residue test results")
            .Produces<TestResultEntryDto>(201)
            .Produces(400);

        // Simple Select Test (Test ID 220)
        testSpecificGroup.MapPost("/simple-select", 
            async (SimpleSelectTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveSimpleSelectTestAsync(dto);
                return Results.Created($"/api/test-results/{result.SampleId}/{result.TestId}", result);
            })
            .WithName("SaveSimpleSelectTest")
            .WithSummary("Save Simple Select test")
            .WithDescription("Saves Simple Select test results")
            .Produces<TestResultEntryDto>(201)
            .Produces(400);

        // RBOT Fail Time Test (Test ID 230)
        testSpecificGroup.MapPost("/rbot-fail-time", 
            async (RbotFailTimeTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveRbotFailTimeTestAsync(dto);
                return Results.Created($"/api/test-results/{result.SampleId}/{result.TestId}", result);
            })
            .WithName("SaveRbotFailTimeTest")
            .WithSummary("Save RBOT Fail Time test")
            .WithDescription("Saves RBOT Fail Time test results")
            .Produces<TestResultEntryDto>(201)
            .Produces(400);

        // Inspect Filter Test (Test ID 240)
        testSpecificGroup.MapPost("/inspect-filter", 
            async (InspectFilterTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveInspectFilterTestAsync(dto);
                return Results.Created($"/api/test-results/{result.SampleId}/{result.TestId}", result);
            })
            .WithName("SaveInspectFilterTest")
            .WithSummary("Save Inspect Filter test")
            .WithDescription("Saves Inspect Filter test results")
            .Produces<TestResultEntryDto>(201)
            .Produces(400);

        // D-inch Test (Test ID 284)
        testSpecificGroup.MapPost("/d-inch", 
            async (DInchTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveDInchTestAsync(dto);
                return Results.Created($"/api/test-results/{result.SampleId}/{result.TestId}", result);
            })
            .WithName("SaveDInchTest")
            .WithSummary("Save D-inch test")
            .WithDescription("Saves D-inch test results")
            .Produces<TestResultEntryDto>(201)
            .Produces(400);

        // Oil Content Test (Test ID 285)
        testSpecificGroup.MapPost("/oil-content", 
            async (OilContentTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveOilContentTestAsync(dto);
                return Results.Created($"/api/test-results/{result.SampleId}/{result.TestId}", result);
            })
            .WithName("SaveOilContentTest")
            .WithSummary("Save Oil Content test")
            .WithDescription("Saves Oil Content test results")
            .Produces<TestResultEntryDto>(201)
            .Produces(400);

        // Varnish Potential Test (Test ID 286)
        testSpecificGroup.MapPost("/varnish-potential", 
            async (VarnishPotentialTestDto dto, ITestResultService service) =>
            {
                var result = await service.SaveVarnishPotentialTestAsync(dto);
                return Results.Created($"/api/test-results/{result.SampleId}/{result.TestId}", result);
            })
            .WithName("SaveVarnishPotentialTest")
            .WithSummary("Save Varnish Potential test")
            .WithDescription("Saves Varnish Potential test results")
            .Produces<TestResultEntryDto>(201)
            .Produces(400);
    }
}
