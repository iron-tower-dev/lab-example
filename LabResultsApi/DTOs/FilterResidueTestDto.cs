using System.ComponentModel.DataAnnotations;

namespace LabResultsApi.DTOs;

public class FilterResidueTestDto
{
    [Required]
    public int SampleId { get; set; }
    [Required]
    public short TestId { get; set; }
    public short TrialNumber { get; set; } = 1;
    public double? SampleSize { get; set; }
    public double? ResidueWeight { get; set; }
    public double? FinalWeight { get; set; }
    public string? Major { get; set; }
    public string? Minor { get; set; }
    public string? Trace { get; set; }
    public string? Narrative { get; set; }
    public string? Comments { get; set; }
    public string Status { get; set; } = "S";
}
