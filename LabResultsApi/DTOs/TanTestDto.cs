namespace LabResultsApi.DTOs;

public class TanTestDto
{
    public int SampleId { get; set; }
    public short TestId { get; set; }
    public short TrialNumber { get; set; }
    public double SampleWeight { get; set; }
    public double FinalBuret { get; set; }
    public double TanCalculated { get; set; }
    public string? EquipmentId { get; set; }
    public string Status { get; set; } = "S";
    public string? Comments { get; set; }
    public string? EntryId { get; set; }
    public DateTime? EntryDate { get; set; }
}
