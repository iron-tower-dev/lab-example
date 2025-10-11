namespace LabResultsApi.DTOs;

public class DeleteriousTestDto
{
    public int SampleId { get; set; }
    public short TestId { get; set; }
    public short TrialNumber { get; set; }
    public string? DeleteriousMteId { get; set; }
    public double Pressure { get; set; }
    public double Scratches { get; set; }
    public string PassFail { get; set; } = "pass"; // "pass" or "fail"
    public string Status { get; set; } = "S";
    public string? Comments { get; set; }
    public string? EntryId { get; set; }
    public DateTime? EntryDate { get; set; }
}
