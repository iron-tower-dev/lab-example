namespace LabResultsApi.DTOs;

public class ParticleCountTestDto
{
    public int SampleId { get; set; }
    public int TestId { get; set; }
    public int TrialNumber { get; set; }
    public double? Micron5_10 { get; set; }
    public double? Micron10_15 { get; set; }
    public double? Micron15_25 { get; set; }
    public double? Micron25_50 { get; set; }
    public double? Micron50_100 { get; set; }
    public double? Micron100 { get; set; }
    public string? IsoCode { get; set; }
    public string? NasClass { get; set; }
    public DateTime? TestDate { get; set; }
    public string Status { get; set; } = "S";
    public string? Comments { get; set; }
    public string? EntryId { get; set; }
    public DateTime? EntryDate { get; set; }
}
