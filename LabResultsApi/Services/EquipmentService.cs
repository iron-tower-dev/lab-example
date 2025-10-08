using Microsoft.EntityFrameworkCore;
using LabResultsApi.Data;
using LabResultsApi.DTOs;

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
            .Where(e => e.EquipType == equipmentType && (e.Exclude != true));

        if (testId.HasValue)
        {
            query = query.Where(e => e.TestId == testId.Value);
        }

        var equipment = await query.ToListAsync();

        return equipment.Select(e => new EquipmentDto
        {
            Name = e.EquipName,
            EquipmentType = e.EquipType ?? string.Empty,
            DueDate = e.DueDate,
            IsOverdue = e.DueDate.HasValue && e.DueDate.Value < DateTime.UtcNow.AddDays(29),
            IsExcluded = e.Exclude == true,
            TestId = e.TestId,
            Value1 = e.Val1,
            Value2 = e.Val2
        }).ToList();
    }

    public async Task<List<EquipmentDto>> GetViscometersAsync(string lubeType, short testId)
    {
        // Get required tube size for the lubricant
        var lubricant = await _context.Lubricants
            .FirstOrDefaultAsync(l => l.Type == lubeType);

        var requiredSize = testId == 50 ? lubricant?.TubeSizeVis40 : lubricant?.TubeSizeVis100;

        var viscometers = await _context.MAndTEquips
            .Where(e => e.EquipType == "VISCOMETER" && 
                       e.TestId == testId && 
                       (e.Exclude != true))
            .OrderByDescending(e => e.Val2)
            .ToListAsync();

        return viscometers.Select(e => new EquipmentDto
        {
            Name = e.EquipName,
            EquipmentType = "VISCOMETER",
            DueDate = e.DueDate,
            IsOverdue = e.DueDate.HasValue && e.DueDate.Value < DateTime.UtcNow.AddDays(29),
            IsExcluded = e.Exclude == true,
            TestId = e.TestId,
            Value1 = e.Val1,
            Value2 = e.Val2
        }).ToList();
    }

    public async Task<List<EquipmentDto>> GetCommentsByAreaAsync(string area)
    {
        var comments = await _context.Comments
            .Where(c => c.Area == area)
            .ToListAsync();

        return comments.Select(c => new EquipmentDto
        {
            Name = c.Remark ?? string.Empty,
            EquipmentType = "COMMENT"
        }).ToList();
    }

    private static string FormatEquipmentDisplayText(Models.MAndTEquip equipment)
    {
        var displayText = equipment.EquipName;
        
        if (equipment.DueDate.HasValue)
        {
            var dueDate = equipment.DueDate.Value;
            var isOverdue = dueDate < DateTime.UtcNow.AddDays(29);
            var suffix = isOverdue ? "*" : "";
            displayText += $" ({dueDate:MM/dd/yyyy}{suffix})";
        }
        else
        {
            displayText += " (no date)";
        }

        return displayText;
    }

    private static string GetViscometerSuffix(string? actualSize, short? requiredSize)
    {
        if (string.IsNullOrEmpty(actualSize) || !requiredSize.HasValue)
            return string.Empty;

        if (int.TryParse(actualSize, out var actual) && int.TryParse(requiredSize.ToString(), out var required))
        {
            if (actual > required)
                return "**";
            if (actual == required)
                return "*";
        }

        return string.Empty;
    }

    public async Task<List<EquipmentDto>> GetEquipmentForTestAsync(short testId)
    {
        var equipment = await _context.MAndTEquips
            .Where(e => e.TestId == testId && (e.Exclude != true))
            .ToListAsync();

        return equipment.Select(e => new EquipmentDto
        {
            Name = e.EquipName,
            EquipmentType = e.EquipType ?? string.Empty,
            DueDate = e.DueDate,
            IsOverdue = e.DueDate.HasValue && e.DueDate.Value < DateTime.UtcNow.AddDays(29),
            IsExcluded = e.Exclude == true,
            TestId = e.TestId,
            Value1 = e.Val1,
            Value2 = e.Val2
        }).ToList();
    }

    public async Task<List<EquipmentDto>> GetOverdueEquipmentAsync()
    {
        var overdueEquipment = await _context.MAndTEquips
            .Where(e => e.DueDate.HasValue && e.DueDate.Value < DateTime.UtcNow && (e.Exclude != true))
            .ToListAsync();

        return overdueEquipment.Select(e => new EquipmentDto
        {
            Name = e.EquipName,
            EquipmentType = e.EquipType ?? string.Empty,
            DueDate = e.DueDate,
            IsOverdue = true,
            IsExcluded = e.Exclude == true,
            TestId = e.TestId,
            Value1 = e.Val1,
            Value2 = e.Val2
        }).ToList();
    }

    public async Task<object> ValidateEquipmentSelectionAsync(int equipmentId, short testId)
    {
        // Note: MAndTEquip doesn't have an Id property, so this method needs to be reimplemented
        // For now, return a placeholder response
        return new { IsValid = true, Message = "Equipment validation not implemented" };
    }
}
