namespace LabResultsApi.DTOs;

public class OxidationStabilityTestDto
{
    public int SampleId { get; set; }
    public short TestId { get; set; }
    public short TrialNumber { get; set; }
    public string? ThermometerMteId { get; set; }
    public int PassFailResult { get; set; } // 1=Pass, 2=Light Fail, 3=Moderate Fail, 4=Severe Fail
    public string Status { get; set; } = "S";
    public string? Comments { get; set; }
    public string? EntryId { get; set; }
    public DateTime? EntryDate { get; set; }
}
