using LabResultsApi.DTOs;

namespace LabResultsApi.Services;

public interface IParticleAnalysisService
{
    Task<List<ParticleTypeDto>> GetParticleTypesAsync(int sampleId, short testId);
    Task<List<ParticleTypeCategoryDto>> GetParticleTypeCategoriesAsync();
    Task<List<ParticleSubTypeDefinitionDto>> GetParticleSubTypeDefinitionsAsync();
    Task<bool> SaveParticleTypesAsync(int sampleId, short testId, List<ParticleTypeDto> particleTypes);
    Task<ParticleAnalysisDto> GetParticleAnalysisAsync(int sampleId, short testId);
    Task<ParticleAnalysisDto> SaveParticleAnalysisAsync(ParticleAnalysisDto dto);
}
