namespace LabResultsApi.DTOs;

public class TestStatusDto
{
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public List<string> CanTransitionTo { get; set; } = new();
    public bool RequiresReview { get; set; }
    public bool IsFinal { get; set; }
}

public class StatusTransitionDto
{
    public string FromStatus { get; set; } = string.Empty;
    public string ToStatus { get; set; } = string.Empty;
    public bool Allowed { get; set; }
    public string? Reason { get; set; }
}

public class TestWorkflowDto
{
    public short TestId { get; set; }
    public List<string> StatusFlow { get; set; } = new();
    public bool ReviewRequired { get; set; }
    public bool PartialSaveAllowed { get; set; }
    public bool DeleteAllowed { get; set; }
}

public class TestResultStatusDto
{
    public int SampleId { get; set; }
    public short TestId { get; set; }
    public short TrialNumber { get; set; }
    public string Status { get; set; } = string.Empty;
    public string EntryId { get; set; } = string.Empty;
    public DateTime EntryDate { get; set; }
    public string? ReviewId { get; set; }
    public DateTime? ReviewDate { get; set; }
    public string? Comments { get; set; }
}
