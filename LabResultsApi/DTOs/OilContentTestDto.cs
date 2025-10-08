using System.ComponentModel.DataAnnotations;

namespace LabResultsApi.DTOs;

public class OilContentTestDto
{
    [Required]
    public int SampleId { get; set; }
    [Required]
    public short TestId { get; set; }
    public short TrialNumber { get; set; } = 1;
    public double? OilContent { get; set; }
    public string? Comments { get; set; }
    public string Status { get; set; } = "S";
    public string? EntryId { get; set; }
}
