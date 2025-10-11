using System.ComponentModel.DataAnnotations;

namespace LabResultsApi.DTOs;

public class InspectFilterTestDto
{
    [Required]
    public int SampleId { get; set; }
    [Required]
    public short TestId { get; set; }
    public short TrialNumber { get; set; } = 1;
    public string? VolumeOfOilUsed { get; set; } // ~500ml, ~250ml, ~50ml, ~25ml, Appr. X ml
    public string? Major { get; set; }
    public string? Minor { get; set; }
    public string? Trace { get; set; }
    public string? Narrative { get; set; }
    public string? Comments { get; set; }
    public string Status { get; set; } = "S";
    public string? InspectionResult { get; set; }
    public string? EntryId { get; set; }
}
