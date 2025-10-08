namespace LabResultsApi.Models;

public class UsedLubeSample
{
    public int Id { get; set; }
    public string? TagNumber { get; set; }
    public string? Component { get; set; }
    public string? Location { get; set; }
    public string? LubeType { get; set; }
    public string? WoNumber { get; set; }
    public string? TrackingNumber { get; set; }
    public string? WarehouseId { get; set; }
    public string? BatchNumber { get; set; }
    public string? ClassItem { get; set; }
    public DateTime? SampleDate { get; set; }
    public DateTime? ReceivedOn { get; set; }
    public string? SampledBy { get; set; }
    public short? Status { get; set; }
    public byte? CmptSelectFlag { get; set; }
    public byte? NewUsedFlag { get; set; }
    public string? EntryId { get; set; }
    public string? ValidateId { get; set; }
    public short? TestPricesId { get; set; }
    public short? PricingPackageId { get; set; }
    public byte? Evaluation { get; set; }
    public int? SiteId { get; set; }
    public DateTime? ResultsReviewDate { get; set; }
    public DateTime? ResultsAvailDate { get; set; }
    public string? ResultsReviewId { get; set; }
    public string? StoreSource { get; set; }
    public string? Schedule { get; set; }
    public DateTime? ReturnedDate { get; set; }

    // Navigation properties
    public ICollection<TestReading> TestReadings { get; set; } = new List<TestReading>();
    public Component? ComponentNavigation { get; set; }
    public Location? LocationNavigation { get; set; }
    public Lubricant? Lubricant { get; set; }
}
