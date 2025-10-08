namespace LabResultsApi.Models;

public class TestReading
{
    public int SampleId { get; set; }
    public short TestId { get; set; }
    public short TrialNumber { get; set; }
    public double? Value1 { get; set; }
    public double? Value2 { get; set; }
    public double? Value3 { get; set; }
    public double? TrialCalc { get; set; }
    public string? Id1 { get; set; }
    public string? Id2 { get; set; }
    public string? Id3 { get; set; }
    public bool? TrialComplete { get; set; }
    public string? Status { get; set; }
    public string? SchedType { get; set; }
    public string? EntryId { get; set; }
    public string? ValidateId { get; set; }
    public DateTime? EntryDate { get; set; }
    public DateTime? ValiDate { get; set; }
    public string? MainComments { get; set; }

    // Navigation properties
    public Test Test { get; set; } = null!;
    public UsedLubeSample UsedLubeSample { get; set; } = null!;
}
