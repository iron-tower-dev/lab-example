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
    public string? Description { get; set; }
    public string? Abbrev { get; set; }
    public string? ShortAbbrev { get; set; }
    public short? TestStandId { get; set; }
    public short? SampleVolumeRequired { get; set; }
    public string? Exclude { get; set; }
    public short? DisplayGroupId { get; set; }
    public string? GroupName { get; set; }
    public bool? Lab { get; set; }
    public bool? Schedule { get; set; }
    public bool IsActive { get; set; }
}

public class UserQualificationDto
{
    public string EmployeeId { get; set; } = string.Empty;
    public short TestId { get; set; }
    public int TestStandId { get; set; }
    public string TestStand { get; set; } = string.Empty;
    public string QualificationLevel { get; set; } = string.Empty;
    public DateTime? QualificationDate { get; set; } // null = unknown/not available
    public DateTime? ExpiryDate { get; set; }
    public bool? IsExpired { get; set; } // null = unknown, computed from ExpiryDate when available
    public bool CanEnter { get; set; }
    public bool CanReview { get; set; }
    public bool CanReviewOwn { get; set; }
}

public class TestStandDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class QualificationLevelDto
{
    public string Level { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> Permissions { get; set; } = new();
}
