namespace LabResultsApi.DTOs;

public class SampleInfoDto
{
    public int Id { get; set; }
    public string? TagNumber { get; set; }
    public string? Component { get; set; }
    public string? ComponentName { get; set; }
    public string? Location { get; set; }
    public string? LocationName { get; set; }
    public string? LubeType { get; set; }
    public string? QualityClass { get; set; }
    public string? NewUsedFlag { get; set; }
    public string? CNRLevel { get; set; }
    public string? CNRText { get; set; }
    public string? CNRColor { get; set; }
    public string? FColor { get; set; }
}

public class TestInfoDto
{
    public short Id { get; set; }
    public string? Name { get; set; }
    public string? Abbrev { get; set; }
    public string? ShortAbbrev { get; set; }
    public bool? Lab { get; set; }
    public bool? Schedule { get; set; }
}

public class UserQualificationDto
{
    public string EmployeeId { get; set; } = string.Empty;
    public string QualificationLevel { get; set; } = string.Empty;
    public bool CanEnter { get; set; }
    public bool CanReview { get; set; }
    public bool CanReviewOwn { get; set; }
}
