namespace LabResultsApi.Models;

public class ParticleType
{
    public int SampleId { get; set; }
    public short TestId { get; set; }
    public int ParticleTypeDefinitionId { get; set; }
    public string? Status { get; set; }
    public string? Comments { get; set; }

    // Navigation properties
    public ParticleTypeDefinition ParticleTypeDefinition { get; set; } = null!;
    public ICollection<ParticleSubType> ParticleSubTypes { get; set; } = new List<ParticleSubType>();
}
