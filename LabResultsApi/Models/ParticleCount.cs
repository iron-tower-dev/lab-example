namespace LabResultsApi.Models;

public class ParticleCount
{
    public int? Id { get; set; }
    public double? Micron5_10 { get; set; }
    public double? Micron10_15 { get; set; }
    public double? Micron15_25 { get; set; }
    public double? Micron25_50 { get; set; }
    public double? Micron50_100 { get; set; }
    public double? Micron100 { get; set; }
    public DateTime? TestDate { get; set; }
    public string? IsoCode { get; set; }
    public string? NasClass { get; set; }
}
