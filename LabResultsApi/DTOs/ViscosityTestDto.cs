namespace LabResultsApi.DTOs;

public class ViscosityTestDto
{
    public int SampleId { get; set; }
    public int TestId { get; set; }
    public int TrialNumber { get; set; }
    public string? ThermometerMteId { get; set; }
    public string? TimerMteId { get; set; }
    public string? ViscometerId { get; set; }
    public double StopWatchTime { get; set; }
    public double CstResult { get; set; }
    public string Status { get; set; } = "S";
    public string? Comments { get; set; }
    public string? EntryId { get; set; }
    public DateTime? EntryDate { get; set; }
}
