namespace LabResultsApi.DTOs;

public class EmissionSpectroDto
{
    public int SampleId { get; set; }
    public short TestId { get; set; }
    public short TrialNumber { get; set; }
    
    // Element concentrations
    public double? Na { get; set; }
    public double? Mo { get; set; }
    public double? Mg { get; set; }
    public double? P { get; set; }
    public double? B { get; set; }
    public double? H { get; set; }
    public double? Cr { get; set; }
    public double? Ca { get; set; }
    public double? Ni { get; set; }
    public double? Ag { get; set; }
    public double? Cu { get; set; }
    public double? Sn { get; set; }
    public double? Al { get; set; }
    public double? Mn { get; set; }
    public double? Pb { get; set; }
    public double? Fe { get; set; }
    public double? Si { get; set; }
    public double? Ba { get; set; }
    public double? Sb { get; set; }
    public double? Zn { get; set; }
    
    public DateTime? TrialDate { get; set; }
    public string Status { get; set; } = "S";
    public string? Comments { get; set; }
    public string? EntryId { get; set; }
    public DateTime? EntryDate { get; set; }
    public bool ScheduleNextTest { get; set; }
}
