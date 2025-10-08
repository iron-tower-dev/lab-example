namespace LabResultsApi.DTOs;

public class TestStatusUpdateDto
{
    public int SampleId { get; set; }
    public short TestId { get; set; }
    public string NewStatus { get; set; } = string.Empty;
    public string? Comments { get; set; }
}
