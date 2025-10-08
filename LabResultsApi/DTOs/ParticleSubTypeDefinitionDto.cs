namespace LabResultsApi.DTOs;

public class ParticleSubTypeDefinitionDto
{
    public int Id { get; set; }
    public int ParticleSubTypeCategoryId { get; set; }
    public string Value { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
    public string CategoryDescription { get; set; } = string.Empty;
}
