namespace LabResultsApi.Models;

public class MAndTEquip
{
    public string EquipName { get; set; } = string.Empty;
    public string? EquipType { get; set; }
    public DateTime? DueDate { get; set; }
    public string? Val1 { get; set; }
    public string? Val2 { get; set; }
    public short? TestId { get; set; }
    public bool? Exclude { get; set; }
}
