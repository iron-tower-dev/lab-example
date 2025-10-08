namespace LabResultsApi.DTOs;

public class ParticleTypeDto
{
    public int Id { get; set; }
    public int SampleId { get; set; }
    public short TestId { get; set; }
    public int ParticleTypeDefinitionId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? ParticleTypeName { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // "N/A", "Review", "Active"
    public string? Comments { get; set; }
    public string? Heat { get; set; }
    public string? Concentration { get; set; }
    public string? SizeAve { get; set; }
    public string? SizeMax { get; set; }
    public string? Color { get; set; }
    public string? Texture { get; set; }
    public string? Composition { get; set; }
    public string? Severity { get; set; }
    public List<ParticleSubTypeDto> SubTypes { get; set; } = new();
}

public class ParticleSubTypeDto
{
    public int Id { get; set; }
    public int SampleId { get; set; }
    public short TestId { get; set; }
    public int ParticleTypeId { get; set; }
    public int ParticleTypeDefinitionId { get; set; }
    public int ParticleSubTypeCategoryId { get; set; }
    public string CategoryDescription { get; set; } = string.Empty;
    public string? CategoryName { get; set; }
    public string Value { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
