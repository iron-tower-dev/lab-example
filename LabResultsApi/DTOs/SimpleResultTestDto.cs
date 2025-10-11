using System.ComponentModel.DataAnnotations;

namespace LabResultsApi.DTOs;

public class SimpleResultTestDto
{
    [Required]
    public int SampleId { get; set; }
    [Required]
    public short TestId { get; set; }
    public short TrialNumber { get; set; } = 1;
    public double? Value1 { get; set; }
    public double? Result { get; set; }
    public string? Comments { get; set; }
    public string Status { get; set; } = "S";
    public string? EntryId { get; set; }
}
