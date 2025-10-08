namespace LabResultsApi.DTOs;

public class RbotTestDto
{
    public int SampleId { get; set; }
    public short TestId { get; set; }
    public short TrialNumber { get; set; }
    public string? ThermometerMteId { get; set; }
    public double FailTime { get; set; }
    public string Status { get; set; } = "S";
    public string? Comments { get; set; }
    public string? EntryId { get; set; }
    public DateTime? EntryDate { get; set; }
}
