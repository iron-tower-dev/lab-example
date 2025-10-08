using System.ComponentModel.DataAnnotations;

namespace LabResultsApi.DTOs;

public class TestResultEntryDto
{
    [Required]
    public int SampleId { get; set; }
    
    [Required]
    public short TestId { get; set; }
    
    [Required]
    public short TrialNumber { get; set; }
    
    public double? Value1 { get; set; }
    public double? Value2 { get; set; }
    public double? Value3 { get; set; }
    public double? TrialCalc { get; set; }
    public string? Id1 { get; set; }
    public string? Id2 { get; set; }
    public string? Id3 { get; set; }
    public string? Status { get; set; }
    public string? MainComments { get; set; }
    public string? EntryId { get; set; }
    public DateTime? EntryDate { get; set; }
    public bool IsPartialSave { get; set; }
    public bool IsMediaReady { get; set; }
    public bool IsDelete { get; set; }
}

public class TestResultSaveDto
{
    [Required]
    public int SampleId { get; set; }
    
    [Required]
    public short TestId { get; set; }
    
    [Required]
    public string Mode { get; set; } = string.Empty; // "entry", "reviewaccept", "reviewreject"
    
    public List<TestResultEntryDto> Entries { get; set; } = new();
    public bool IsPartialSave { get; set; }
    public bool IsMediaReady { get; set; }
    public bool IsDelete { get; set; }
}

public class TestResultResponseDto
{
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
    public string? SqlError { get; set; }
}
