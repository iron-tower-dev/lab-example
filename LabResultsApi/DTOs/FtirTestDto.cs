namespace LabResultsApi.DTOs;

public class FtirTestDto
{
    public int SampleId { get; set; }
    public short TestId { get; set; }
    public short TrialNumber { get; set; }
    public double? DeltaArea { get; set; }
    public double? AntiOxidant { get; set; }
    public double? Oxidation { get; set; }
    public double? H2O { get; set; }
    public double? AntiWear { get; set; }
    public double? Soot { get; set; }
    public double? FuelDilution { get; set; }
    public double? Mixture { get; set; }
    public double? WeakAcid { get; set; }
    public string Status { get; set; } = "S";
    public string? Comments { get; set; }
    public string? EntryId { get; set; }
    public DateTime? EntryDate { get; set; }
}
