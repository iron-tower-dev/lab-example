namespace LabResultsApi.DTOs;

public class EquipmentTypeDto
{
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<int> TestIds { get; set; } = new();
}

public class EquipmentCalibrationDto
{
    public int EquipmentId { get; set; }
    public DateTime CalibrationDate { get; set; }
    public DateTime NextDueDate { get; set; }
    public double CalibrationValue { get; set; }
    public string Status { get; set; } = string.Empty; // 'Valid' | 'Expiring' | 'Expired'
}
