namespace LabResultsApi.Models;

public class LubeTechQualification
{
    public string EmployeeId { get; set; } = string.Empty;
    public short TestStandId { get; set; }
    public string? QualificationLevel { get; set; }
}
