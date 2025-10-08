using Microsoft.EntityFrameworkCore;
using LabResultsApi.Data;
using LabResultsApi.DTOs;
using LabResultsApi.Models;

namespace LabResultsApi.Services;

public class ParticleAnalysisService : IParticleAnalysisService
{
    private readonly LabResultsDbContext _context;

    public ParticleAnalysisService(LabResultsDbContext context)
    {
        _context = context;
    }

    public async Task<List<ParticleTypeDto>> GetParticleTypesAsync(int sampleId, short testId)
    {
        var particleTypes = await _context.ParticleTypes
            .Where(pt => pt.SampleId == sampleId && pt.TestId == testId)
            .Include(pt => pt.ParticleTypeDefinition)
            .Include(pt => pt.ParticleSubTypes)
                .ThenInclude(pst => pst.ParticleSubTypeCategoryDefinition)
            .ToListAsync();

        return particleTypes.Select(pt => new ParticleTypeDto
        {
            SampleId = pt.SampleId,
            TestId = pt.TestId,
            ParticleTypeDefinitionId = pt.ParticleTypeDefinitionId,
            ParticleTypeName = pt.ParticleTypeDefinition?.Name ?? "Unknown",
            Status = pt.Status ?? "X",
            Comments = pt.Comments,
            SubTypes = pt.ParticleSubTypes.Select(pst => new ParticleSubTypeDto
            {
                SampleId = pst.SampleId,
                TestId = pst.TestId,
                ParticleTypeDefinitionId = pst.ParticleTypeDefinitionId,
                ParticleSubTypeCategoryId = pst.ParticleSubTypeCategoryId,
                CategoryName = pst.ParticleSubTypeCategoryDefinition?.Name ?? "Unknown",
                Value = pst.Value?.ToString() ?? "0"
            }).ToList()
        }).ToList();
    }

    public async Task<List<ParticleTypeCategoryDto>> GetParticleTypeCategoriesAsync()
    {
        // Get particle type definitions as categories
        var particleTypeDefinitions = await _context.ParticleTypeDefinitions.ToListAsync();

        return particleTypeDefinitions.Select(ptd => new ParticleTypeCategoryDto
        {
            Id = ptd.Id,
            Name = ptd.Name ?? "Unknown",
            Description = ptd.Description,
            Severity = ptd.Severity ?? "Unknown",
            Color = ptd.Color ?? "#000000",
            Texture = ptd.Texture,
            Composition = ptd.Composition,
            SizeAve = ptd.SizeAve,
            SizeMax = ptd.SizeMax,
            Heat = ptd.Heat
        }).ToList();
    }

    public async Task<List<ParticleSubTypeDefinitionDto>> GetParticleSubTypeDefinitionsAsync()
    {
        var subTypeDefinitions = await _context.ParticleSubTypeCategoryDefinitions.ToListAsync();

        return subTypeDefinitions.Select(std => new ParticleSubTypeDefinitionDto
        {
            Id = std.Id,
            Name = std.Name ?? "Unknown",
            Description = std.Description,
            CategoryId = std.CategoryId,
            CategoryName = std.CategoryName ?? "Unknown",
            Unit = std.Unit,
            MinValue = std.MinValue,
            MaxValue = std.MaxValue,
            DefaultValue = std.DefaultValue
        }).ToList();
    }

    public async Task<bool> SaveParticleTypesAsync(int sampleId, short testId, List<ParticleTypeDto> particleTypes)
    {
        try
        {
            // Remove existing particle types for this sample/test
            var existingParticleTypes = await _context.ParticleTypes
                .Where(pt => pt.SampleId == sampleId && pt.TestId == testId)
                .ToListAsync();

            _context.ParticleTypes.RemoveRange(existingParticleTypes);

            // Add new particle types
            foreach (var particleTypeDto in particleTypes)
            {
                var particleType = new ParticleType
                {
                    SampleId = sampleId,
                    TestId = testId,
                    ParticleTypeDefinitionId = particleTypeDto.ParticleTypeDefinitionId,
                    Status = particleTypeDto.Status,
                    Comments = particleTypeDto.Comments
                };

                _context.ParticleTypes.Add(particleType);

                // Add sub-types
                foreach (var subTypeDto in particleTypeDto.SubTypes)
                {
                    var subType = new ParticleSubType
                    {
                        SampleId = sampleId,
                        TestId = testId,
                        ParticleTypeDefinitionId = particleTypeDto.ParticleTypeDefinitionId,
                        ParticleSubTypeCategoryId = subTypeDto.ParticleSubTypeCategoryId,
                        Value = int.TryParse(subTypeDto.Value, out var intValue) ? intValue : null
                    };

                    _context.ParticleSubTypes.Add(subType);
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<ParticleAnalysisDto> GetParticleAnalysisAsync(int sampleId, short testId)
    {
        var particleTypes = await GetParticleTypesAsync(sampleId, testId);
        var categories = await GetParticleTypeCategoriesAsync();
        var subTypeDefinitions = await GetParticleSubTypeDefinitionsAsync();

        return new ParticleAnalysisDto
        {
            SampleId = sampleId,
            TestId = testId,
            ParticleTypes = particleTypes,
            Categories = categories,
            SubTypeDefinitions = subTypeDefinitions,
            AnalysisDate = DateTime.UtcNow,
            AnalystId = "SYSTEM", // Would come from authentication in real implementation
            Status = particleTypes.Any() ? "COMPLETED" : "PENDING"
        };
    }

    public async Task<ParticleAnalysisDto> SaveParticleAnalysisAsync(ParticleAnalysisDto dto)
    {
        var success = await SaveParticleTypesAsync(dto.SampleId, dto.TestId, dto.ParticleTypes);
        
        if (success)
        {
            return await GetParticleAnalysisAsync(dto.SampleId, dto.TestId);
        }
        else
        {
            throw new InvalidOperationException("Failed to save particle analysis");
        }
    }
}
