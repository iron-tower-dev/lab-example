namespace LabResultsApi.Models;

public class ParticleSubType
{
    public int SampleId { get; set; }
    public short TestId { get; set; }
    public int ParticleTypeDefinitionId { get; set; }
    public int ParticleSubTypeCategoryId { get; set; }
    public int? Value { get; set; }

    // Navigation properties
    public ParticleType ParticleType { get; set; } = null!;
    public ParticleSubTypeCategoryDefinition ParticleSubTypeCategoryDefinition { get; set; } = null!;
}
