namespace LabResultsApi.DTOs;

public class ParticleAnalysisDto
{
    public int SampleId { get; set; }
    public short TestId { get; set; }
    public List<ParticleTypeDto> ParticleTypes { get; set; } = new();
    public DateTime AnalysisDate { get; set; }
    public string OverallSeverity { get; set; } = string.Empty;
    public string? Comments { get; set; }
}
