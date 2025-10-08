using System.ComponentModel.DataAnnotations;

namespace LabResultsApi.DTOs;

public class SimpleSelectTestDto
{
    [Required]
    public int SampleId { get; set; }
    [Required]
    public short TestId { get; set; }
    public short TrialNumber { get; set; } = 1;
    public string? ThermometerId { get; set; }
    public string? Result { get; set; } // Pass, Fail - Light, Fail - Moderate, Fail - Severe
    public string? Comments { get; set; }
    public string Status { get; set; } = "S";
    public string? SelectedValue { get; set; }
    public string? EntryId { get; set; }
}
