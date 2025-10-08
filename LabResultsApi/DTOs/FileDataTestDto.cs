namespace LabResultsApi.DTOs;

public class FileDataTestDto
{
    public int SampleId { get; set; }
    public short TestId { get; set; }
    public short TrialNumber { get; set; }
    public decimal Value1 { get; set; }
    public string FileContent { get; set; } = string.Empty;
}
