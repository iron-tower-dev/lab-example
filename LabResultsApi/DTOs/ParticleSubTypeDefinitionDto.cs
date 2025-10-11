namespace LabResultsApi.DTOs;

public class ParticleSubTypeDefinitionDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string? Unit { get; set; }
    public int? MinValue { get; set; }
    public int? MaxValue { get; set; }
    public int? DefaultValue { get; set; }
    public int ParticleSubTypeCategoryId { get; set; }
    public string Value { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
    public string CategoryDescription { get; set; } = string.Empty;
}
