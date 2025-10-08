using Microsoft.EntityFrameworkCore;
using LabResultsApi.Data;
using LabResultsApi.DTOs;
using LabResultsApi.Models;

namespace LabResultsApi.Services;

public class EquipmentService : IEquipmentService
{
    private readonly LabResultsDbContext _context;

    public EquipmentService(LabResultsDbContext context)
    {
        _context = context;
    }

    public async Task<List<EquipmentDto>> GetEquipmentByTypeAsync(string equipmentType, short? testId = null)
    {
        var query = _context.MAndTEquips
            .Where(e => e.EquipType == equipmentType && e.Exclude != true);

        if (testId.HasValue)
        {
            query = query.Where(e => e.TestId == testId.Value);
        }

        var equipment = await query.ToListAsync();

        return equipment.Select(e => new EquipmentDto
        {
            Id = e.Id,
            Name = e.EquipName ?? "",
            EquipmentType = e.EquipType,
            SerialNumber = null, // Not available in database
            DueDate = e.DueDate ?? DateTime.MaxValue,
            IsOverdue = e.DueDate.HasValue && e.DueDate.Value < DateTime.Now,
            IsExcluded = e.Exclude ?? false,
            TestId = e.TestId ?? 0,
            Value1 = e.Val1?.ToString(),
            Value2 = e.Val2?.ToString(),
            Comments = e.Comments
        }).ToList();
    }

    public async Task<List<EquipmentDto>> GetEquipmentForTestAsync(short testId)
    {
        var equipment = await _context.MAndTEquips
            .Where(e => e.TestId == testId && e.Exclude != true)
            .ToListAsync();

        return equipment.Select(e => new EquipmentDto
        {
            Id = e.Id,
            Name = e.EquipName ?? "",
            EquipmentType = e.EquipType,
            SerialNumber = null, // Not available in database
            DueDate = e.DueDate ?? DateTime.MaxValue,
            IsOverdue = e.DueDate.HasValue && e.DueDate.Value < DateTime.Now,
            IsExcluded = e.Exclude ?? false,
            TestId = e.TestId ?? 0,
            Value1 = e.Val1?.ToString(),
            Value2 = e.Val2?.ToString(),
            Comments = e.Comments
        }).ToList();
    }

    public async Task<List<EquipmentDto>> GetViscometersAsync(string lubeType, short testId)
    {
        // Get viscometers for viscosity tests
        var viscometers = await _context.MAndTEquips
            .Where(e => e.EquipType == "VISCOMETER" && 
                       e.TestId == testId && 
                       e.Exclude != true)
            .ToListAsync();

        return viscometers.Select(e => new EquipmentDto
        {
            Id = e.Id,
            Name = e.EquipName ?? "",
            EquipmentType = e.EquipType,
            SerialNumber = null, // Not available in database
            DueDate = e.DueDate ?? DateTime.MaxValue,
            IsOverdue = e.DueDate.HasValue && e.DueDate.Value < DateTime.Now,
            IsExcluded = e.Exclude ?? false,
            TestId = e.TestId ?? 0,
            Value1 = e.Val1?.ToString(),
            Value2 = e.Val2?.ToString(),
            Comments = e.Comments
        }).ToList();
    }

    public async Task<List<EquipmentDto>> GetCommentsByAreaAsync(string area)
    {
        // This would typically filter by area, but since we don't have area information
        // in the database, we'll return equipment with comments
        var equipment = await _context.MAndTEquips
            .Where(e => !string.IsNullOrEmpty(e.Comments) && e.Exclude != true)
            .ToListAsync();

        return equipment.Select(e => new EquipmentDto
        {
            Id = e.Id,
            Name = e.EquipName ?? "",
            EquipmentType = e.EquipType,
            SerialNumber = null, // Not available in database
            DueDate = e.DueDate ?? DateTime.MaxValue,
            IsOverdue = e.DueDate.HasValue && e.DueDate.Value < DateTime.Now,
            IsExcluded = e.Exclude ?? false,
            TestId = e.TestId ?? 0,
            Value1 = e.Val1?.ToString(),
            Value2 = e.Val2?.ToString(),
            Comments = e.Comments
        }).ToList();
    }

    public async Task<List<EquipmentDto>> GetOverdueEquipmentAsync()
    {
        var overdueEquipment = await _context.MAndTEquips
            .Where(e => e.DueDate.HasValue && 
                       e.DueDate.Value < DateTime.Now && 
                       e.Exclude != true)
            .ToListAsync();

        return overdueEquipment.Select(e => new EquipmentDto
        {
            Id = e.Id,
            Name = e.EquipName ?? "",
            EquipmentType = e.EquipType,
            SerialNumber = null, // Not available in database
            DueDate = e.DueDate ?? DateTime.MaxValue,
            IsOverdue = true,
            IsExcluded = e.Exclude ?? false,
            TestId = e.TestId ?? 0,
            Value1 = e.Val1?.ToString(),
            Value2 = e.Val2?.ToString(),
            Comments = e.Comments
        }).ToList();
    }

    public async Task<object> ValidateEquipmentSelectionAsync(int equipmentId, short testId)
    {
        var equipment = await _context.MAndTEquips
            .FirstOrDefaultAsync(e => e.Id == equipmentId);

        if (equipment == null)
        {
            return new
            {
                IsValid = false,
                Message = "Equipment not found",
                EquipmentId = equipmentId,
                TestId = testId
            };
        }

        if (equipment.Exclude == true)
        {
            return new
            {
                IsValid = false,
                Message = "Equipment is excluded from use",
                EquipmentId = equipmentId,
                TestId = testId
            };
        }

        if (equipment.TestId.HasValue && equipment.TestId.Value != testId)
        {
            return new
            {
                IsValid = false,
                Message = "Equipment is not suitable for this test",
                EquipmentId = equipmentId,
                TestId = testId
            };
        }

        var isOverdue = equipment.DueDate.HasValue && equipment.DueDate.Value < DateTime.Now;

        return new
        {
            IsValid = true,
            Message = isOverdue ? "Equipment is overdue for calibration" : "Equipment is valid",
            EquipmentId = equipmentId,
            TestId = testId,
            EquipmentName = equipment.EquipName,
            EquipmentType = equipment.EquipType,
            IsOverdue = isOverdue,
            DueDate = equipment.DueDate,
            Warnings = isOverdue ? new[] { "Equipment calibration is overdue" } : new string[0]
        };
    }
}
