namespace LabResultsApi.Models;

public class MAndTEquip
{
    public int Id { get; set; }
    public string EquipType { get; set; } = string.Empty;
    public string? EquipName { get; set; }
    public bool? Exclude { get; set; }
    public short? TestId { get; set; }
    public DateTime? DueDate { get; set; }
    public string? Comments { get; set; }
    public double? Val1 { get; set; }
    public double? Val2 { get; set; }
    public double? Val3 { get; set; }
    public double? Val4 { get; set; }
}
