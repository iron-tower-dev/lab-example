namespace LabResultsApi.Models;

public class ParticleSubTypeCategoryDefinition
{
    public int Id { get; set; }
    public string Description { get; set; } = string.Empty; // NOT NULL in database
    public string? Active { get; set; } // nvarchar(1) in database, not bool
    public int? SortOrder { get; set; }

    // Navigation properties
    public ICollection<ParticleSubTypeDefinition> ParticleSubTypeDefinitions { get; set; } = new List<ParticleSubTypeDefinition>();
    public ICollection<ParticleSubType> ParticleSubTypes { get; set; } = new List<ParticleSubType>();
}
