namespace LabResultsApi.Models;

public class ParticleTypeDefinition
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty; // NOT NULL in database
    public string Description { get; set; } = string.Empty; // NOT NULL in database
    public string Image1 { get; set; } = string.Empty; // NOT NULL in database
    public string Image2 { get; set; } = string.Empty; // NOT NULL in database
    public string? Active { get; set; } // nvarchar(1) in database, not bool
    public int? SortOrder { get; set; }

    // Navigation properties
    public ICollection<ParticleType> ParticleTypes { get; set; } = new List<ParticleType>();
}
