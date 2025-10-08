namespace LabResultsApi.Models;

public class ParticleSubTypeCategoryDefinition
{
    public int Id { get; set; }
    public string? Description { get; set; }
    public int? SortOrder { get; set; }
    public bool? Active { get; set; }

    // Navigation properties
    public ICollection<ParticleSubTypeDefinition> ParticleSubTypeDefinitions { get; set; } = new List<ParticleSubTypeDefinition>();
    public ICollection<ParticleSubType> ParticleSubTypes { get; set; } = new List<ParticleSubType>();
}
