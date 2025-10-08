namespace LabResultsApi.DTOs;

public class EquipmentDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string EquipmentType { get; set; } = string.Empty;
    public string? SerialNumber { get; set; }
    public DateTime? DueDate { get; set; }
    public bool IsOverdue { get; set; }
    public bool IsExcluded { get; set; }
    public short? TestId { get; set; }
    public string? Value1 { get; set; }
    public string? Value2 { get; set; }
    public string? Comments { get; set; }
}
