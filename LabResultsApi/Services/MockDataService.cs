using LabResultsApi.DTOs;

namespace LabResultsApi.Services;

public class MockDataService : IMockDataService
{
    // Mock equipment data
    private readonly List<EquipmentDto> _mockEquipment = new()
    {
        new EquipmentDto
        {
            Id = 1,
            Name = "THM001",
            EquipmentType = "THERMOMETER",
            DueDate = new DateTime(2024, 12, 31),
            Comments = "Digital thermometer for viscosity testing",
            Value1 = "0.1",
            TestId = 50,
            IsOverdue = false,
            IsExcluded = false
        },
        new EquipmentDto
        {
            Id = 2,
            Name = "THM002",
            EquipmentType = "THERMOMETER",
            DueDate = new DateTime(2024, 11, 15),
            Comments = "Digital thermometer for high temp viscosity",
            Value1 = "0.1",
            TestId = 60,
            IsOverdue = true,
            IsExcluded = false
        },
        new EquipmentDto
        {
            Id = 3,
            Name = "TMR001",
            EquipmentType = "TIMER",
            DueDate = new DateTime(2024, 12, 20),
            Comments = "Stopwatch for viscosity timing",
            TestId = 50,
            IsOverdue = false,
            IsExcluded = false
        },
        new EquipmentDto
        {
            Id = 4,
            Name = "VSC001",
            EquipmentType = "VISCOMETER",
            DueDate = new DateTime(2024, 12, 25),
            Comments = "Cannon-Fenske viscometer",
            Value1 = "0.478",
            Value2 = "1.0",
            TestId = 50,
            IsOverdue = false,
            IsExcluded = false
        },
        new EquipmentDto
        {
            Id = 5,
            Name = "VSC002",
            EquipmentType = "VISCOMETER",
            DueDate = new DateTime(2024, 12, 30),
            Comments = "Cannon-Fenske viscometer for 100°C",
            Value1 = "0.478",
            Value2 = "1.0",
            TestId = 60,
            IsOverdue = false,
            IsExcluded = false
        },
        new EquipmentDto
        {
            Id = 6,
            Name = "BAR001",
            EquipmentType = "BAROMETER",
            DueDate = new DateTime(2024, 12, 15),
            Comments = "Barometric pressure gauge",
            TestId = 80,
            IsOverdue = false,
            IsExcluded = false
        },
        new EquipmentDto
        {
            Id = 7,
            Name = "DEL001",
            EquipmentType = "DELETERIOUS",
            DueDate = new DateTime(2024, 12, 10),
            Comments = "Deleterious test apparatus",
            TestId = 250,
            IsOverdue = false,
            IsExcluded = false
        }
    };

    private readonly List<EquipmentTypeDto> _equipmentTypes = new()
    {
        new EquipmentTypeDto
        {
            Type = "THERMOMETER",
            Description = "Temperature measurement equipment",
            TestIds = new List<int> { 50, 60, 80, 140, 170, 220, 230 }
        },
        new EquipmentTypeDto
        {
            Type = "TIMER",
            Description = "Timing equipment",
            TestIds = new List<int> { 50, 60 }
        },
        new EquipmentTypeDto
        {
            Type = "VISCOMETER",
            Description = "Viscosity measurement equipment",
            TestIds = new List<int> { 50, 60 }
        },
        new EquipmentTypeDto
        {
            Type = "BAROMETER",
            Description = "Barometric pressure measurement",
            TestIds = new List<int> { 80 }
        },
        new EquipmentTypeDto
        {
            Type = "DELETERIOUS",
            Description = "Deleterious test equipment",
            TestIds = new List<int> { 250 }
        }
    };

    // Mock user qualification data
    private readonly List<UserQualificationDto> _mockQualifications = new()
    {
        new UserQualificationDto { EmployeeId = "USER1", TestStandId = 1, TestStand = "General Lab", QualificationLevel = "Q/QAG" },
        new UserQualificationDto { EmployeeId = "USER1", TestStandId = 2, TestStand = "Microscopy", QualificationLevel = "MicrE" },
        new UserQualificationDto { EmployeeId = "USER2", TestStandId = 1, TestStand = "General Lab", QualificationLevel = "TRAIN" },
        new UserQualificationDto { EmployeeId = "USER3", TestStandId = 1, TestStand = "General Lab", QualificationLevel = "Q/QAG" },
        new UserQualificationDto { EmployeeId = "USER3", TestStandId = 2, TestStand = "Microscopy", QualificationLevel = "MicrE" }
    };

    private readonly List<TestStandDto> _mockTestStands = new()
    {
        new TestStandDto { Id = 1, Name = "General Lab" },
        new TestStandDto { Id = 2, Name = "Microscopy" },
        new TestStandDto { Id = 3, Name = "Specialized Testing" }
    };

    private readonly List<QualificationLevelDto> _qualificationLevels = new()
    {
        new QualificationLevelDto
        {
            Level = "Q/QAG",
            Description = "Qualified/Quality Assurance Qualified",
            Permissions = new List<string> { "enter", "review", "accept", "reject", "delete" }
        },
        new QualificationLevelDto
        {
            Level = "MicrE",
            Description = "Microscopy Expert",
            Permissions = new List<string> { "enter", "review", "accept", "reject", "delete", "microscopy" }
        },
        new QualificationLevelDto
        {
            Level = "TRAIN",
            Description = "Training",
            Permissions = new List<string> { "enter", "partial_save" }
        }
    };

    // Mock status management data
    private readonly List<TestStatusDto> _testStatuses = new()
    {
        new TestStatusDto
        {
            Code = "X",
            Description = "Not Started",
            Color = "#6c757d",
            CanTransitionTo = new List<string> { "T", "S", "A", "P" },
            RequiresReview = false,
            IsFinal = false
        },
        new TestStatusDto
        {
            Code = "T",
            Description = "Training",
            Color = "#ffc107",
            CanTransitionTo = new List<string> { "S", "A", "P", "E" },
            RequiresReview = false,
            IsFinal = false
        },
        new TestStatusDto
        {
            Code = "A",
            Description = "Accepted (Partial)",
            Color = "#17a2b8",
            CanTransitionTo = new List<string> { "S", "P", "E" },
            RequiresReview = false,
            IsFinal = false
        },
        new TestStatusDto
        {
            Code = "P",
            Description = "Partial",
            Color = "#fd7e14",
            CanTransitionTo = new List<string> { "S", "E" },
            RequiresReview = false,
            IsFinal = false
        },
        new TestStatusDto
        {
            Code = "E",
            Description = "Ready for Microscope",
            Color = "#6f42c1",
            CanTransitionTo = new List<string> { "S", "D" },
            RequiresReview = true,
            IsFinal = false
        },
        new TestStatusDto
        {
            Code = "S",
            Description = "Saved",
            Color = "#28a745",
            CanTransitionTo = new List<string> { "D" },
            RequiresReview = true,
            IsFinal = false
        },
        new TestStatusDto
        {
            Code = "D",
            Description = "Validated",
            Color = "#007bff",
            CanTransitionTo = new List<string>(),
            RequiresReview = false,
            IsFinal = true
        },
        new TestStatusDto
        {
            Code = "C",
            Description = "Cancelled",
            Color = "#dc3545",
            CanTransitionTo = new List<string>(),
            RequiresReview = false,
            IsFinal = true
        }
    };

    private readonly Dictionary<int, TestWorkflowDto> _testWorkflows = new()
    {
        { 10, new TestWorkflowDto { TestId = 10, StatusFlow = new List<string> { "X", "T", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = false, DeleteAllowed = true } },
        { 30, new TestWorkflowDto { TestId = 30, StatusFlow = new List<string> { "X", "T", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = false, DeleteAllowed = true } },
        { 40, new TestWorkflowDto { TestId = 40, StatusFlow = new List<string> { "X", "T", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = false, DeleteAllowed = true } },
        { 50, new TestWorkflowDto { TestId = 50, StatusFlow = new List<string> { "X", "T", "A", "P", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = true, DeleteAllowed = true } },
        { 60, new TestWorkflowDto { TestId = 60, StatusFlow = new List<string> { "X", "T", "A", "P", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = true, DeleteAllowed = true } },
        { 70, new TestWorkflowDto { TestId = 70, StatusFlow = new List<string> { "X", "T", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = false, DeleteAllowed = true } },
        { 80, new TestWorkflowDto { TestId = 80, StatusFlow = new List<string> { "X", "T", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = false, DeleteAllowed = true } },
        { 110, new TestWorkflowDto { TestId = 110, StatusFlow = new List<string> { "X", "T", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = false, DeleteAllowed = true } },
        { 120, new TestWorkflowDto { TestId = 120, StatusFlow = new List<string> { "X", "T", "A", "E", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = true, DeleteAllowed = true } },
        { 130, new TestWorkflowDto { TestId = 130, StatusFlow = new List<string> { "X", "T", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = false, DeleteAllowed = true } },
        { 140, new TestWorkflowDto { TestId = 140, StatusFlow = new List<string> { "X", "T", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = false, DeleteAllowed = true } },
        { 160, new TestWorkflowDto { TestId = 160, StatusFlow = new List<string> { "X", "T", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = false, DeleteAllowed = true } },
        { 170, new TestWorkflowDto { TestId = 170, StatusFlow = new List<string> { "X", "T", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = false, DeleteAllowed = true } },
        { 180, new TestWorkflowDto { TestId = 180, StatusFlow = new List<string> { "X", "T", "A", "E", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = true, DeleteAllowed = true } },
        { 210, new TestWorkflowDto { TestId = 210, StatusFlow = new List<string> { "X", "T", "A", "P", "E", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = true, DeleteAllowed = true } },
        { 220, new TestWorkflowDto { TestId = 220, StatusFlow = new List<string> { "X", "T", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = false, DeleteAllowed = true } },
        { 230, new TestWorkflowDto { TestId = 230, StatusFlow = new List<string> { "X", "T", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = false, DeleteAllowed = true } },
        { 240, new TestWorkflowDto { TestId = 240, StatusFlow = new List<string> { "X", "T", "A", "E", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = true, DeleteAllowed = true } },
        { 250, new TestWorkflowDto { TestId = 250, StatusFlow = new List<string> { "X", "T", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = false, DeleteAllowed = true } },
        { 270, new TestWorkflowDto { TestId = 270, StatusFlow = new List<string> { "X", "T", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = false, DeleteAllowed = true } },
        { 284, new TestWorkflowDto { TestId = 284, StatusFlow = new List<string> { "X", "T", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = false, DeleteAllowed = true } },
        { 285, new TestWorkflowDto { TestId = 285, StatusFlow = new List<string> { "X", "T", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = false, DeleteAllowed = true } },
        { 286, new TestWorkflowDto { TestId = 286, StatusFlow = new List<string> { "X", "T", "S", "D" }, ReviewRequired = true, PartialSaveAllowed = false, DeleteAllowed = true } }
    };

    // Equipment methods
    public Task<List<EquipmentDto>> GetAllEquipmentAsync()
    {
        return Task.FromResult(_mockEquipment.ToList());
    }

    public Task<List<EquipmentDto>> GetEquipmentByTypeAsync(string equipType)
    {
        var equipment = _mockEquipment.Where(e => e.EquipmentType == equipType && !e.IsExcluded).ToList();
        return Task.FromResult(equipment);
    }

    public Task<List<EquipmentDto>> GetEquipmentForTestAsync(int testId)
    {
        var equipment = _mockEquipment.Where(e => e.TestId == testId && !e.IsExcluded).ToList();
        return Task.FromResult(equipment);
    }

    public Task<List<EquipmentDto>> GetEquipmentByTypeAndTestAsync(string equipType, int testId)
    {
        var equipment = _mockEquipment.Where(e => e.EquipmentType == equipType && e.TestId == testId && !e.IsExcluded).ToList();
        return Task.FromResult(equipment);
    }

    public Task<EquipmentDto?> GetEquipmentByIdAsync(int id)
    {
        var equipment = _mockEquipment.FirstOrDefault(e => e.Id == id);
        return Task.FromResult(equipment);
    }

    public Task<EquipmentDto?> GetEquipmentByNameAsync(string equipName)
    {
        var equipment = _mockEquipment.FirstOrDefault(e => e.Name == equipName);
        return Task.FromResult(equipment);
    }

    public Task<List<EquipmentTypeDto>> GetEquipmentTypesAsync()
    {
        return Task.FromResult(_equipmentTypes.ToList());
    }

    public Task<List<EquipmentTypeDto>> GetEquipmentTypesForTestAsync(int testId)
    {
        var types = _equipmentTypes.Where(type => type.TestIds.Contains(testId)).ToList();
        return Task.FromResult(types);
    }

    public Task<List<EquipmentDto>> GetOverdueEquipmentAsync()
    {
        var today = DateTime.UtcNow;
        var overdue = _mockEquipment.Where(e => e.DueDate.HasValue && e.DueDate.Value < today && !e.IsExcluded).ToList();
        return Task.FromResult(overdue);
    }

    public Task<List<EquipmentDto>> GetEquipmentExpiringWithinDaysAsync(int days)
    {
        var today = DateTime.UtcNow;
        var futureDate = today.AddDays(days);
        var expiring = _mockEquipment.Where(e => e.DueDate.HasValue && e.DueDate.Value >= today && e.DueDate.Value <= futureDate && !e.IsExcluded).ToList();
        return Task.FromResult(expiring);
    }

    public Task<EquipmentDto> AddEquipmentAsync(EquipmentDto equipment)
    {
        var newId = _mockEquipment.Max(e => e.Id) + 1;
        equipment.Id = newId;
        equipment.IsOverdue = equipment.DueDate.HasValue && equipment.DueDate.Value < DateTime.UtcNow;
        _mockEquipment.Add(equipment);
        return Task.FromResult(equipment);
    }

    public Task<EquipmentDto?> UpdateEquipmentAsync(int id, EquipmentDto updates)
    {
        var index = _mockEquipment.FindIndex(e => e.Id == id);
        if (index == -1) return Task.FromResult<EquipmentDto?>(null);

        var updatedEquipment = new EquipmentDto
        {
            Id = _mockEquipment[index].Id,
            Name = updates.Name,
            EquipmentType = updates.EquipmentType,
            DueDate = updates.DueDate,
            Comments = updates.Comments,
            Value1 = updates.Value1,
            Value2 = updates.Value2,
            TestId = updates.TestId,
            IsOverdue = updates.DueDate.HasValue ? updates.DueDate.Value < DateTime.UtcNow : _mockEquipment[index].IsOverdue,
            IsExcluded = updates.IsExcluded
        };

        _mockEquipment[index] = updatedEquipment;
        return Task.FromResult<EquipmentDto?>(updatedEquipment);
    }

    public Task<bool> DeleteEquipmentAsync(int id)
    {
        var index = _mockEquipment.FindIndex(e => e.Id == id);
        if (index == -1) return Task.FromResult(false);

        _mockEquipment[index].IsExcluded = true;
        return Task.FromResult(true);
    }

    public Task<object?> GetViscometerCalibrationAsync(string equipName)
    {
        var equipment = _mockEquipment.FirstOrDefault(e => e.Name == equipName && e.EquipmentType == "VISCOMETER");
        if (equipment == null) return Task.FromResult<object?>(null);

        return Task.FromResult<object?>(new
        {
            calibration = double.Parse(equipment.Value1 ?? "0"),
            tubeSize = double.Parse(equipment.Value2 ?? "0")
        });
    }

    public Task<bool> IsEquipmentSuitableForTestAsync(string equipName, int testId)
    {
        var equipment = _mockEquipment.FirstOrDefault(e => e.Name == equipName);
        if (equipment == null || equipment.IsExcluded) return Task.FromResult(false);
        return Task.FromResult(equipment.TestId == testId);
    }

    public Task<string> GetEquipmentStatusAsync(string equipName)
    {
        var equipment = _mockEquipment.FirstOrDefault(e => e.Name == equipName);
        if (equipment == null) return Task.FromResult("Excluded");

        if (equipment.IsExcluded) return Task.FromResult("Excluded");
        if (equipment.IsOverdue) return Task.FromResult("Overdue");

        if (equipment.DueDate.HasValue)
        {
            var daysUntilDue = Math.Ceiling((equipment.DueDate.Value - DateTime.UtcNow).TotalDays);
            if (daysUntilDue <= 30) return Task.FromResult("Expiring");
        }

        return Task.FromResult("Available");
    }

    public Task<string> GetEquipmentSuffixAsync(string equipName)
    {
        var equipment = _mockEquipment.FirstOrDefault(e => e.Name == equipName);
        if (equipment == null) return Task.FromResult("");

        var suffix = "";
        if (equipment.IsOverdue) suffix += "*";
        if (equipment.DueDate.HasValue)
        {
            var daysUntilDue = Math.Ceiling((equipment.DueDate.Value - DateTime.UtcNow).TotalDays);
            if (daysUntilDue <= 30 && daysUntilDue > 0) suffix += "*";
        }
        return Task.FromResult(suffix);
    }

    public Task<object?> GetEquipmentWithDueDateInfoAsync(string equipName)
    {
        var equipment = _mockEquipment.FirstOrDefault(e => e.Name == equipName);
        if (equipment == null) return Task.FromResult<object?>(null);

        var dueDateInfo = "";
        if (equipment.DueDate.HasValue)
        {
            var daysUntilDue = Math.Ceiling((equipment.DueDate.Value - DateTime.UtcNow).TotalDays);
            if (daysUntilDue < 0)
                dueDateInfo = $"Overdue by {Math.Abs(daysUntilDue)} days";
            else if (daysUntilDue == 0)
                dueDateInfo = "Due today";
            else if (daysUntilDue <= 30)
                dueDateInfo = $"Due in {daysUntilDue} days";
            else
                dueDateInfo = $"Due {equipment.DueDate.Value:MM/dd/yyyy}";
        }
        else
        {
            dueDateInfo = "No due date";
        }

        return Task.FromResult<object?>(new { equipment, dueDateInfo });
    }

    public Task<Dictionary<string, int>> GetEquipmentUsageStatsAsync()
    {
        var stats = new Dictionary<string, int>();
        foreach (var equipment in _mockEquipment.Where(e => !e.IsExcluded))
        {
            if (stats.ContainsKey(equipment.EquipmentType))
                stats[equipment.EquipmentType]++;
            else
                stats[equipment.EquipmentType] = 1;
        }
        return Task.FromResult(stats);
    }

    public Task<List<EquipmentDto>> GetMaintenanceScheduleAsync()
    {
        var today = DateTime.UtcNow;
        var nextMonth = today.AddDays(30);
        var schedule = _mockEquipment.Where(e => e.DueDate.HasValue && e.DueDate.Value >= today && e.DueDate.Value <= nextMonth && !e.IsExcluded)
            .OrderBy(e => e.DueDate)
            .ToList();
        return Task.FromResult(schedule);
    }

    public Task<object> ValidateEquipmentForTestAsync(string equipName, int testId, string equipType)
    {
        var equipment = _mockEquipment.FirstOrDefault(e => e.Name == equipName);
        if (equipment == null)
            return Task.FromResult<object>(new { isValid = false, message = "Equipment not found" });

        if (equipment.IsExcluded)
            return Task.FromResult<object>(new { isValid = false, message = "Equipment is excluded from use" });

        if (equipment.EquipmentType != equipType)
            return Task.FromResult<object>(new { isValid = false, message = $"Equipment type mismatch. Expected {equipType}, got {equipment.EquipmentType}" });

        if (equipment.TestId != testId)
            return Task.FromResult<object>(new { isValid = false, message = $"Equipment not suitable for test ID {testId}" });

        if (equipment.IsOverdue)
            return Task.FromResult<object>(new { isValid = false, message = "Equipment calibration is overdue" });

        return Task.FromResult<object>(new { isValid = true, message = "Equipment is valid for use" });
    }

    // User qualification methods
    public Task<List<UserQualificationDto>> GetUserQualificationsAsync(string userId)
    {
        var qualifications = _mockQualifications.Where(q => q.EmployeeId == userId).ToList();
        return Task.FromResult(qualifications);
    }

    public Task<string?> IsUserQualifiedAsync(string userId, int testId)
    {
        var qualifications = _mockQualifications.Where(q => q.EmployeeId == userId).ToList();
        var testStandId = GetTestStandIdForTest(testId);
        var qualification = qualifications.FirstOrDefault(q => q.TestStandId == testStandId);
        return Task.FromResult(qualification?.QualificationLevel);
    }

    public Task<string?> IsUserQualifiedToReviewAsync(string userId, int testId)
    {
        var qualification = IsUserQualifiedAsync(userId, testId).Result;
        if (qualification == "Q/QAG" || qualification == "MicrE")
            return Task.FromResult(qualification);
        return Task.FromResult<string?>(null);
    }

    public Task<bool> CanUserPerformActionAsync(string userId, int testId, string action)
    {
        var qualification = IsUserQualifiedAsync(userId, testId).Result;
        if (qualification == null) return Task.FromResult(false);

        var level = _qualificationLevels.FirstOrDefault(l => l.Level == qualification);
        return Task.FromResult(level?.Permissions.Contains(action) ?? false);
    }

    public Task<List<TestStandDto>> GetTestStandsAsync()
    {
        return Task.FromResult(_mockTestStands.ToList());
    }

    public Task<List<QualificationLevelDto>> GetQualificationLevelsAsync()
    {
        return Task.FromResult(_qualificationLevels.ToList());
    }

    public Task<UserQualificationDto> SaveUserQualificationAsync(UserQualificationDto qualification)
    {
        var existingIndex = _mockQualifications.FindIndex(q => q.EmployeeId == qualification.EmployeeId && q.TestStandId == qualification.TestStandId);
        if (existingIndex >= 0)
        {
            _mockQualifications[existingIndex] = qualification;
        }
        else
        {
            _mockQualifications.Add(qualification);
        }
        return Task.FromResult(qualification);
    }

    public Task<bool> RemoveUserQualificationAsync(string employeeId, int testStandId)
    {
        var index = _mockQualifications.FindIndex(q => q.EmployeeId == employeeId && q.TestStandId == testStandId);
        if (index >= 0)
        {
            _mockQualifications.RemoveAt(index);
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }

    public Task<List<UserQualificationDto>> GetUsersByQualificationAsync(int testId, string qualificationLevel)
    {
        var testStandId = GetTestStandIdForTest(testId);
        var users = _mockQualifications.Where(q => q.TestStandId == testStandId && q.QualificationLevel == qualificationLevel).ToList();
        return Task.FromResult(users);
    }

    public Task<bool> CanEnterResultsAsync(string userId, int testId)
    {
        return CanUserPerformActionAsync(userId, testId, "enter");
    }

    public Task<bool> CanReviewResultsAsync(string userId, int testId)
    {
        return CanUserPerformActionAsync(userId, testId, "review");
    }

    public Task<bool> CanAcceptResultsAsync(string userId, int testId)
    {
        return CanUserPerformActionAsync(userId, testId, "accept");
    }

    public Task<bool> CanRejectResultsAsync(string userId, int testId)
    {
        return CanUserPerformActionAsync(userId, testId, "reject");
    }

    public Task<bool> CanDeleteResultsAsync(string userId, int testId)
    {
        return CanUserPerformActionAsync(userId, testId, "delete");
    }

    public Task<bool> CanPartialSaveAsync(string userId, int testId)
    {
        return CanUserPerformActionAsync(userId, testId, "partial_save");
    }

    public Task<bool> HasMicroscopyPermissionsAsync(string userId)
    {
        var qualifications = _mockQualifications.Where(q => q.EmployeeId == userId).ToList();
        return Task.FromResult(qualifications.Any(q => q.QualificationLevel == "MicrE"));
    }

    public Task<string?> GetHighestQualificationLevelAsync(string userId)
    {
        var qualifications = _mockQualifications.Where(q => q.EmployeeId == userId).ToList();
        if (qualifications.Count == 0) return Task.FromResult<string?>(null);

        var priority = new Dictionary<string, int> { { "MicrE", 3 }, { "Q/QAG", 2 }, { "TRAIN", 1 } };
        var highest = qualifications.OrderByDescending(q => priority.GetValueOrDefault(q.QualificationLevel, 0)).First();
        return Task.FromResult<string?>(highest.QualificationLevel);
    }

    public Task<bool> IsSupervisorAsync(string userId)
    {
        var level = GetHighestQualificationLevelAsync(userId).Result;
        return Task.FromResult(level == "Q/QAG" || level == "MicrE");
    }

    public Task<List<UserQualificationDto>> GetSupervisorsAsync()
    {
        var supervisors = _mockQualifications.Where(q => q.QualificationLevel == "Q/QAG" || q.QualificationLevel == "MicrE").ToList();
        return Task.FromResult(supervisors);
    }

    // Status management methods
    public Task<List<TestStatusDto>> GetAllStatusesAsync()
    {
        return Task.FromResult(_testStatuses.ToList());
    }

    public Task<TestStatusDto?> GetStatusByCodeAsync(string code)
    {
        var status = _testStatuses.FirstOrDefault(s => s.Code == code);
        return Task.FromResult(status);
    }

    public Task<TestWorkflowDto?> GetTestWorkflowAsync(int testId)
    {
        _testWorkflows.TryGetValue(testId, out var workflow);
        return Task.FromResult(workflow);
    }

    public Task<StatusTransitionDto> IsStatusTransitionAllowedAsync(string fromStatus, string toStatus, int testId)
    {
        var fromStatusObj = _testStatuses.FirstOrDefault(s => s.Code == fromStatus);
        _testWorkflows.TryGetValue(testId, out var workflow);

        if (fromStatusObj == null || workflow == null)
        {
            return Task.FromResult(new StatusTransitionDto
            {
                FromStatus = fromStatus,
                ToStatus = toStatus,
                Allowed = false,
                Reason = "Invalid status or test workflow not found"
            });
        }

        var allowed = fromStatusObj.CanTransitionTo.Contains(toStatus) && workflow.StatusFlow.Contains(toStatus);
        return Task.FromResult(new StatusTransitionDto
        {
            FromStatus = fromStatus,
            ToStatus = toStatus,
            Allowed = allowed,
            Reason = allowed ? null : "Status transition not allowed for this test"
        });
    }

    public Task<List<TestStatusDto>> GetNextPossibleStatusesAsync(string currentStatus, int testId)
    {
        var currentStatusObj = _testStatuses.FirstOrDefault(s => s.Code == currentStatus);
        _testWorkflows.TryGetValue(testId, out var workflow);

        if (currentStatusObj == null || workflow == null)
            return Task.FromResult(new List<TestStatusDto>());

        var possibleStatuses = currentStatusObj.CanTransitionTo
            .Where(statusCode => workflow.StatusFlow.Contains(statusCode))
            .Select(statusCode => _testStatuses.FirstOrDefault(s => s.Code == statusCode))
            .Where(status => status != null)
            .Cast<TestStatusDto>()
            .ToList();

        return Task.FromResult(possibleStatuses);
    }

    public Task<bool> RequiresReviewAsync(string status)
    {
        var statusObj = _testStatuses.FirstOrDefault(s => s.Code == status);
        return Task.FromResult(statusObj?.RequiresReview ?? false);
    }

    public Task<bool> IsFinalStatusAsync(string status)
    {
        var statusObj = _testStatuses.FirstOrDefault(s => s.Code == status);
        return Task.FromResult(statusObj?.IsFinal ?? false);
    }

    public Task<string> GetStatusColorAsync(string status)
    {
        var statusObj = _testStatuses.FirstOrDefault(s => s.Code == status);
        return Task.FromResult(statusObj?.Color ?? "#6c757d");
    }

    public Task<string> GetStatusDescriptionAsync(string status)
    {
        var statusObj = _testStatuses.FirstOrDefault(s => s.Code == status);
        return Task.FromResult(statusObj?.Description ?? "Unknown Status");
    }

    public Task<bool> IsPartialSaveAllowedAsync(int testId)
    {
        _testWorkflows.TryGetValue(testId, out var workflow);
        return Task.FromResult(workflow?.PartialSaveAllowed ?? false);
    }

    public Task<bool> IsDeleteAllowedAsync(int testId)
    {
        _testWorkflows.TryGetValue(testId, out var workflow);
        return Task.FromResult(workflow?.DeleteAllowed ?? false);
    }

    public Task<bool> IsReviewRequiredAsync(int testId)
    {
        _testWorkflows.TryGetValue(testId, out var workflow);
        return Task.FromResult(workflow?.ReviewRequired ?? true);
    }

    public Task<string> GetPartialSaveStatusAsync(int testId, string userQualification)
    {
        if (testId == 210) // Ferrogram
            return Task.FromResult("P"); // Partial status for Ferrogram
        return Task.FromResult("A"); // Accepted status for other tests
    }

    public Task<string> GetFullSaveStatusAsync(int testId, string userQualification)
    {
        return Task.FromResult("S"); // Saved status
    }

    public Task<string> GetMediaReadyStatusAsync(int testId)
    {
        return Task.FromResult("E"); // Ready for Microscope
    }

    public Task<string> GetTrainingStatusAsync()
    {
        return Task.FromResult("T"); // Training status
    }

    public Task<string> GetValidationStatusAsync()
    {
        return Task.FromResult("D"); // Validated status
    }

    public Task<string> GetCancellationStatusAsync()
    {
        return Task.FromResult("C"); // Cancelled status
    }

    public Task<bool> CanPerformActionAsync(string action, string currentStatus, int testId, string userQualification)
    {
        return action switch
        {
            "enter" => Task.FromResult(new[] { "X", "T", "A", "P" }.Contains(currentStatus)),
            "partial_save" => IsPartialSaveAllowedAsync(testId).ContinueWith(t => t.Result && new[] { "X", "T", "A", "P" }.Contains(currentStatus)),
            "full_save" => Task.FromResult(new[] { "X", "T", "A", "P" }.Contains(currentStatus)),
            "media_ready" => Task.FromResult(new[] { "X", "T", "A", "P", "S" }.Contains(currentStatus)),
            "review" => RequiresReviewAsync(currentStatus).ContinueWith(t => t.Result && (userQualification == "Q/QAG" || userQualification == "MicrE")),
            "accept" => Task.FromResult(new[] { "E", "S" }.Contains(currentStatus) && (userQualification == "Q/QAG" || userQualification == "MicrE")),
            "reject" => Task.FromResult(new[] { "E", "S" }.Contains(currentStatus) && (userQualification == "Q/QAG" || userQualification == "MicrE")),
            "delete" => IsDeleteAllowedAsync(testId).ContinueWith(t => t.Result && new[] { "T", "A", "P", "E", "S" }.Contains(currentStatus) && (userQualification == "Q/QAG" || userQualification == "MicrE")),
            "clear" => Task.FromResult(new[] { "X", "T", "A", "P" }.Contains(currentStatus)),
            _ => Task.FromResult(false)
        };
    }

    public Task<List<object>> GetStatusWorkflowForDisplayAsync(int testId)
    {
        _testWorkflows.TryGetValue(testId, out var workflow);
        if (workflow == null) return Task.FromResult(new List<object>());

        var workflowDisplay = workflow.StatusFlow.Select(statusCode =>
        {
            var status = _testStatuses.FirstOrDefault(s => s.Code == statusCode);
            return new
            {
                status = statusCode,
                description = status?.Description ?? "Unknown",
                color = status?.Color ?? "#6c757d"
            };
        }).Cast<object>().ToList();

        return Task.FromResult(workflowDisplay);
    }

    public Task<Dictionary<string, int>> GetStatusStatisticsAsync(int testId)
    {
        // Mock statistics
        var mockStats = new Dictionary<string, int>
        {
            { "X", 5 },
            { "T", 3 },
            { "A", 2 },
            { "P", 1 },
            { "E", 4 },
            { "S", 8 },
            { "D", 12 },
            { "C", 1 }
        };
        return Task.FromResult(mockStats);
    }

    public Task<List<TestResultStatusDto>> GetOverdueTestsAsync()
    {
        var mockOverdue = new List<TestResultStatusDto>
        {
            new TestResultStatusDto
            {
                SampleId = 1001,
                TestId = 50,
                TrialNumber = 1,
                Status = "T",
                EntryId = "USER1",
                EntryDate = new DateTime(2024, 1, 1)
            },
            new TestResultStatusDto
            {
                SampleId = 1002,
                TestId = 120,
                TrialNumber = 1,
                Status = "E",
                EntryId = "USER2",
                EntryDate = new DateTime(2024, 1, 2)
            }
        };
        return Task.FromResult(mockOverdue);
    }

    public Task<List<TestResultStatusDto>> GetTestsPendingReviewAsync()
    {
        var mockPending = new List<TestResultStatusDto>
        {
            new TestResultStatusDto
            {
                SampleId = 1003,
                TestId = 70,
                TrialNumber = 1,
                Status = "S",
                EntryId = "USER3",
                EntryDate = new DateTime(2024, 1, 3)
            },
            new TestResultStatusDto
            {
                SampleId = 1004,
                TestId = 210,
                TrialNumber = 1,
                Status = "E",
                EntryId = "USER4",
                EntryDate = new DateTime(2024, 1, 4)
            }
        };
        return Task.FromResult(mockPending);
    }

    private int GetTestStandIdForTest(int testId)
    {
        var testStandMapping = new Dictionary<int, int>
        {
            { 10, 1 },   // TAN - General Lab
            { 20, 1 },   // File Data - General Lab
            { 30, 1 },   // Emission Spectro (New) - General Lab
            { 40, 1 },   // Emission Spectro (Used) - General Lab
            { 50, 1 },   // Viscosity 40°C - General Lab
            { 60, 1 },   // Viscosity 100°C - General Lab
            { 70, 1 },   // FTIR - General Lab
            { 80, 1 },   // Flash Point - General Lab
            { 110, 1 },  // Simple Result - General Lab
            { 120, 2 },  // Filter Inspection - Microscopy
            { 130, 1 },  // Grease Penetration - General Lab
            { 140, 1 },  // Grease Dropping Point - General Lab
            { 160, 1 },  // Particle Count - General Lab
            { 170, 1 },  // RBOT - General Lab
            { 180, 2 },  // Filter Residue - Microscopy
            { 210, 2 },  // Ferrogram - Microscopy
            { 220, 1 },  // Oxidation Stability - General Lab
            { 230, 1 },  // RBOT Fail Time - General Lab
            { 240, 2 },  // Inspect Filter - Microscopy
            { 250, 1 },  // Deleterious - General Lab
            { 270, 1 },  // Simple Select - General Lab
            { 284, 1 },  // Rheometer D-inch - General Lab
            { 285, 1 },  // Rheometer Oil Content - General Lab
            { 286, 1 }   // Rheometer Varnish Potential - General Lab
        };

        return testStandMapping.GetValueOrDefault(testId, 1); // Default to General Lab
    }
}
