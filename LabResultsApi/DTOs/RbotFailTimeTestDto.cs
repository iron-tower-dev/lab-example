using System.ComponentModel.DataAnnotations;

namespace LabResultsApi.DTOs;

public class RbotFailTimeTestDto
{
    [Required]
    public int SampleId { get; set; }
    [Required]
    public short TestId { get; set; }
    public short TrialNumber { get; set; } = 1;
    public string? ThermometerId { get; set; }
    public double? FailTime { get; set; }
    public string? FileData { get; set; }
    public string? Comments { get; set; }
    public string Status { get; set; } = "S";
    public string? EntryId { get; set; }
}
