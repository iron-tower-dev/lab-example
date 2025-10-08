namespace LabResultsApi.DTOs;

public class ParticleTypeCategoryDto
{
    public int Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public int SubtypeCount { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
}
