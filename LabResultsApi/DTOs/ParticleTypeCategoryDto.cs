namespace LabResultsApi.DTOs;

public class ParticleTypeCategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Severity { get; set; }
    public string? Color { get; set; }
    public string? Texture { get; set; }
    public string? Composition { get; set; }
    public string? SizeAve { get; set; }
    public string? SizeMax { get; set; }
    public string? Heat { get; set; }
    public int SubtypeCount { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
}
