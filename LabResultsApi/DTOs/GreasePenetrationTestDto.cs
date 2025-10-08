namespace LabResultsApi.DTOs;

public class GreasePenetrationTestDto
{
    public int SampleId { get; set; }
    public short TestId { get; set; }
    public short TrialNumber { get; set; }
    public double FirstPenetration { get; set; }
    public double SecondPenetration { get; set; }
    public double ThirdPenetration { get; set; }
    public double Result { get; set; }
    public string? Nlgi { get; set; }
    public string Status { get; set; } = "S";
    public string? Comments { get; set; }
    public string? EntryId { get; set; }
    public DateTime? EntryDate { get; set; }
}
