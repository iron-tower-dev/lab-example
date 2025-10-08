namespace LabResultsApi.Models;

public class ParticleTypeDefinition
{
    public int Id { get; set; }
    public string? Type { get; set; }
    public string? Description { get; set; }
    public string? Image1 { get; set; }
    public string? Image2 { get; set; }
    public int? SortOrder { get; set; }
    public bool? Active { get; set; }

    // Navigation properties
    public ICollection<ParticleType> ParticleTypes { get; set; } = new List<ParticleType>();
}
