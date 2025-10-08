namespace LabResultsApi.DTOs;

public class FlashPointTestDto
{
    public int SampleId { get; set; }
    public int TestId { get; set; }
    public int TrialNumber { get; set; }
    public string? BarometerMteId { get; set; }
    public string? ThermometerMteId { get; set; }
    public double BarometricPressure { get; set; }
    public double FlashPointTemperature { get; set; }
    public double Result { get; set; }
    public string Status { get; set; } = "S";
    public string? Comments { get; set; }
    public string? EntryId { get; set; }
    public DateTime? EntryDate { get; set; }
}
