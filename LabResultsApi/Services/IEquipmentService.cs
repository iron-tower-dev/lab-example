using LabResultsApi.DTOs;

namespace LabResultsApi.Services;

public interface IEquipmentService
{
    Task<List<EquipmentDto>> GetEquipmentByTypeAsync(string equipmentType, short? testId = null);
    Task<List<EquipmentDto>> GetEquipmentForTestAsync(short testId);
    Task<List<EquipmentDto>> GetViscometersAsync(string lubeType, short testId);
    Task<List<EquipmentDto>> GetCommentsByAreaAsync(string area);
    Task<List<EquipmentDto>> GetOverdueEquipmentAsync();
    Task<object> ValidateEquipmentSelectionAsync(int equipmentId, short testId);
}
