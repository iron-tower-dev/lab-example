namespace LabResultsApi.DTOs;

public class RheometerTestDto
{
    public int SampleId { get; set; }
    public int TestId { get; set; }
    public int TrialNumber { get; set; }
    public double? DInch { get; set; } // For Test ID 284
    public double? OilContent { get; set; } // For Test ID 285
    public double? VarnishPotentialRating { get; set; } // For Test ID 286
    public string Status { get; set; } = "S";
    public string? Comments { get; set; }
    public string? EntryId { get; set; }
    public DateTime? EntryDate { get; set; }
}
