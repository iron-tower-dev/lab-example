namespace LabResultsApi.Models;

public class Test
{
    public short Id { get; set; }
    public string? Name { get; set; }
    public short? TestStandId { get; set; }
    public short? SampleVolumeRequired { get; set; }
    public string? Exclude { get; set; }
    public string? Abbrev { get; set; }
    public short? DisplayGroupId { get; set; }
    public string? GroupName { get; set; }
    public bool? Lab { get; set; }
    public bool? Schedule { get; set; }
    public string? ShortAbbrev { get; set; }

    // Navigation properties
    public ICollection<TestReading> TestReadings { get; set; } = new List<TestReading>();
}
