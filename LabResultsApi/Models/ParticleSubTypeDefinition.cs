namespace LabResultsApi.Models;

public class ParticleSubTypeDefinition
{
    public int ParticleSubTypeCategoryId { get; set; }
    public int Value { get; set; }
    public string Description { get; set; } = string.Empty; // NOT NULL in database
    public string? Active { get; set; } // nvarchar(1) in database, not bool
    public int? SortOrder { get; set; }

    // Navigation properties
    public ParticleSubTypeCategoryDefinition ParticleSubTypeCategoryDefinition { get; set; } = null!;
}
