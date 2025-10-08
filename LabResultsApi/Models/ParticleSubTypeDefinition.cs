namespace LabResultsApi.Models;

public class ParticleSubTypeDefinition
{
    public int Id { get; set; }
    public int ParticleSubTypeCategoryId { get; set; }
    public int? Value { get; set; }
    public string? Description { get; set; }
    public int? SortOrder { get; set; }
    public bool? Active { get; set; }

    // Navigation properties
    public ParticleSubTypeCategoryDefinition ParticleSubTypeCategoryDefinition { get; set; } = null!;
}
