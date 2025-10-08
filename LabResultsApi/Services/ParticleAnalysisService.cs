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
        var particleTypes = await _context.ParticleTypeDefinitions
            .Where(ptd => ptd.Active == true)
            .OrderBy(ptd => ptd.SortOrder)
            .ToListAsync();

        var result = new List<ParticleTypeDto>();

        foreach (var pt in particleTypes)
        {
            var existingParticleType = await _context.ParticleTypes
                .FirstOrDefaultAsync(pt => pt.SampleId == sampleId && 
                                          pt.TestId == testId && 
                                          pt.ParticleTypeDefinitionId == pt.Id);

            var subTypes = await GetParticleSubTypesAsync(sampleId, testId, pt.Id);

            result.Add(new ParticleTypeDto
            {
                SampleId = sampleId,
                TestId = testId,
                ParticleTypeDefinitionId = pt.Id,
                Type = pt.Type ?? string.Empty,
                Description = pt.Description ?? string.Empty,
                Status = existingParticleType?.Status ?? "0",
                Comments = existingParticleType?.Comments,
                SubTypes = subTypes
            });
        }

        return result;
    }

    public async Task<List<ParticleTypeCategoryDto>> GetParticleTypeCategoriesAsync()
    {
        return await _context.ParticleSubTypeCategoryDefinitions
            .Where(c => c.Active == true)
            .OrderBy(c => c.SortOrder)
            .Select(c => new ParticleTypeCategoryDto
            {
                Id = c.Id,
                Description = c.Description ?? string.Empty,
                SortOrder = c.SortOrder ?? 0,
                SubtypeCount = c.ParticleSubTypeDefinitions.Count(s => s.Active == true),
                IsActive = c.Active == true
            })
            .ToListAsync();
    }

    public async Task<List<ParticleSubTypeDefinitionDto>> GetParticleSubTypeDefinitionsAsync()
    {
        return await _context.ParticleSubTypeDefinitions
            .Include(psd => psd.ParticleSubTypeCategoryDefinition)
            .Where(psd => psd.Active == true && psd.ParticleSubTypeCategoryDefinition.Active == true)
            .OrderBy(psd => psd.ParticleSubTypeCategoryDefinition.SortOrder)
            .ThenBy(psd => psd.SortOrder)
            .Select(psd => new ParticleSubTypeDefinitionDto
            {
                Id = psd.Id,
                ParticleSubTypeCategoryId = psd.ParticleSubTypeCategoryId,
                CategoryDescription = psd.ParticleSubTypeCategoryDefinition.Description ?? string.Empty,
                Value = psd.Value ?? string.Empty,
                Description = psd.Description ?? string.Empty,
                SortOrder = psd.SortOrder ?? 0,
                IsActive = psd.Active == true
            })
            .ToListAsync();
    }

    public async Task<bool> SaveParticleTypesAsync(int sampleId, short testId, List<ParticleTypeDto> particleTypes)
    {
        try
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            foreach (var pt in particleTypes)
            {
                // Save or update particle type
                var existingParticleType = await _context.ParticleTypes
                    .FirstOrDefaultAsync(pt => pt.SampleId == sampleId && 
                                              pt.TestId == testId && 
                                              pt.ParticleTypeDefinitionId == pt.ParticleTypeDefinitionId);

                if (existingParticleType == null)
                {
                    var newParticleType = new ParticleType
                    {
                        SampleId = sampleId,
                        TestId = testId,
                        ParticleTypeDefinitionId = pt.ParticleTypeDefinitionId,
                        Status = pt.Status,
                        Comments = pt.Comments,
                        Heat = pt.Heat,
                        Concentration = pt.Concentration,
                        SizeAve = pt.SizeAve,
                        SizeMax = pt.SizeMax,
                        Color = pt.Color,
                        Texture = pt.Texture,
                        Composition = pt.Composition,
                        Severity = pt.Severity
                    };
                    _context.ParticleTypes.Add(newParticleType);
                }
                else
                {
                    existingParticleType.Status = pt.Status;
                    existingParticleType.Comments = pt.Comments;
                    existingParticleType.Heat = pt.Heat;
                    existingParticleType.Concentration = pt.Concentration;
                    existingParticleType.SizeAve = pt.SizeAve;
                    existingParticleType.SizeMax = pt.SizeMax;
                    existingParticleType.Color = pt.Color;
                    existingParticleType.Texture = pt.Texture;
                    existingParticleType.Composition = pt.Composition;
                    existingParticleType.Severity = pt.Severity;
                }

                // Handle sub-types
                if (pt.Status == "1") // Review status
                {
                    await SaveParticleSubTypesAsync(sampleId, testId, pt.ParticleTypeDefinitionId, pt.SubTypes);
                }
                else
                {
                    await DeleteParticleSubTypesAsync(sampleId, testId, pt.ParticleTypeDefinitionId);
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }

    private async Task<List<ParticleSubTypeDto>> GetParticleSubTypesAsync(int sampleId, short testId, int particleTypeDefinitionId)
    {
        var subTypes = await _context.ParticleSubTypes
            .Include(pst => pst.ParticleSubTypeCategoryDefinition)
            .Where(pst => pst.SampleId == sampleId && 
                         pst.TestId == testId && 
                         pst.ParticleTypeDefinitionId == particleTypeDefinitionId)
            .ToListAsync();

        return subTypes.Select(st => new ParticleSubTypeDto
        {
            ParticleSubTypeCategoryId = st.ParticleSubTypeCategoryId,
            CategoryDescription = st.ParticleSubTypeCategoryDefinition.Description,
            Value = st.Value
        }).ToList();
    }

    private async Task SaveParticleSubTypesAsync(int sampleId, short testId, int particleTypeDefinitionId, List<ParticleSubTypeDto> subTypes)
    {
        foreach (var subType in subTypes)
        {
            var existing = await _context.ParticleSubTypes
                .FirstOrDefaultAsync(pst => pst.SampleId == sampleId && 
                                           pst.TestId == testId && 
                                           pst.ParticleTypeDefinitionId == particleTypeDefinitionId && 
                                           pst.ParticleSubTypeCategoryId == subType.ParticleSubTypeCategoryId);

            if (existing == null)
            {
                var newSubType = new ParticleSubType
                {
                    SampleId = sampleId,
                    TestId = testId,
                    ParticleTypeDefinitionId = particleTypeDefinitionId,
                    ParticleSubTypeCategoryId = subType.ParticleSubTypeCategoryId,
                    Value = subType.Value
                };
                _context.ParticleSubTypes.Add(newSubType);
            }
            else
            {
                existing.Value = subType.Value;
            }
        }
    }

    private async Task DeleteParticleSubTypesAsync(int sampleId, short testId, int particleTypeDefinitionId)
    {
        var subTypes = await _context.ParticleSubTypes
            .Where(pst => pst.SampleId == sampleId && 
                         pst.TestId == testId && 
                         pst.ParticleTypeDefinitionId == particleTypeDefinitionId)
            .ToListAsync();

        _context.ParticleSubTypes.RemoveRange(subTypes);
    }

    public async Task<ParticleAnalysisDto> GetParticleAnalysisAsync(int sampleId, short testId)
    {
        var particleTypes = await GetParticleTypesAsync(sampleId, testId);
        
        return new ParticleAnalysisDto
        {
            SampleId = sampleId,
            TestId = testId,
            ParticleTypes = particleTypes,
            AnalysisDate = DateTime.Now,
            OverallSeverity = DetermineOverallSeverity(particleTypes)
        };
    }

    public async Task<ParticleAnalysisDto> SaveParticleAnalysisAsync(ParticleAnalysisDto dto)
    {
        var success = await SaveParticleTypesAsync(dto.SampleId, dto.TestId, dto.ParticleTypes);
        
        if (success)
        {
            return await GetParticleAnalysisAsync(dto.SampleId, dto.TestId);
        }
        
        throw new InvalidOperationException("Failed to save particle analysis");
    }

    private static string DetermineOverallSeverity(List<ParticleTypeDto> particleTypes)
    {
        var activeParticleTypes = particleTypes.Where(pt => pt.Status == "1").ToList();
        
        if (!activeParticleTypes.Any())
            return "0";
        
        // Simple logic to determine overall severity based on active particle types
        // In a real implementation, this would be more sophisticated
        var severityCount = activeParticleTypes.Count(pt => !string.IsNullOrEmpty(pt.Severity));
        
        return severityCount switch
        {
            0 => "1",
            <= 2 => "2",
            <= 4 => "3",
            _ => "4"
        };
    }
}
