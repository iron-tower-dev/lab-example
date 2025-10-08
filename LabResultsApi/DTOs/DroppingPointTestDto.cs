namespace LabResultsApi.DTOs;

public class DroppingPointTestDto
{
    public int SampleId { get; set; }
    public int TestId { get; set; }
    public int TrialNumber { get; set; }
    public string? DroppingPointThermometerId { get; set; }
    public string? BlockThermometerId { get; set; }
    public double DroppingPointTemperature { get; set; }
    public double BlockTemperature { get; set; }
    public double Result { get; set; }
    public string Status { get; set; } = "S";
    public string? Comments { get; set; }
    public string? EntryId { get; set; }
    public DateTime? EntryDate { get; set; }
}
