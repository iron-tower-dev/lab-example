using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using LabResultsApi.Data;
using LabResultsApi.Services;
using LabResultsApi.DTOs;
using System.Threading.Tasks;
using System.Linq;

namespace LabResultsApi.Tests.Services
{
    public class EquipmentServiceTests : IDisposable
    {
        private readonly LabResultsDbContext _context;
        private readonly EquipmentService _service;
        private readonly Mock<ILogger<EquipmentService>> _mockLogger;

        public EquipmentServiceTests()
        {
            var options = new DbContextOptionsBuilder<LabResultsDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new LabResultsDbContext(options);
            _mockLogger = new Mock<ILogger<EquipmentService>>();
            _service = new EquipmentService(_context, _mockLogger.Object);

            SeedTestData();
        }

        [Fact]
        public async Task GetEquipmentByTypeAsync_ValidType_ReturnsEquipment()
        {
            // Arrange
            var equipmentType = "THERMOMETER";
            var testId = (short)10;

            // Act
            var result = await _service.GetEquipmentByTypeAsync(equipmentType, testId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<EquipmentDto>>(result);
        }

        [Fact]
        public async Task GetViscometersAsync_ValidLubeType_ReturnsViscometers()
        {
            // Arrange
            var lubeType = "HYDRAULIC";
            var testId = (short)50;

            // Act
            var result = await _service.GetViscometersAsync(lubeType, testId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<EquipmentDto>>(result);
        }

        [Fact]
        public async Task GetCommentsByAreaAsync_ValidArea_ReturnsComments()
        {
            // Arrange
            var area = "LAB";

            // Act
            var result = await _service.GetCommentsByAreaAsync(area);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<EquipmentDto>>(result);
        }

        [Fact]
        public async Task GetEquipmentForTestAsync_ValidTestId_ReturnsEquipment()
        {
            // Arrange
            var testId = (short)10;

            // Act
            var result = await _service.GetEquipmentForTestAsync(testId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<EquipmentDto>>(result);
        }

        [Fact]
        public async Task GetOverdueEquipmentAsync_ReturnsOverdueEquipment()
        {
            // Act
            var result = await _service.GetOverdueEquipmentAsync();

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<EquipmentDto>>(result);
        }

        [Fact]
        public async Task ValidateEquipmentSelectionAsync_ValidEquipment_ReturnsValidationResult()
        {
            // Arrange
            var equipmentId = 1;
            var testId = (short)10;

            // Act
            var result = await _service.ValidateEquipmentSelectionAsync(equipmentId, testId);

            // Assert
            Assert.NotNull(result);
        }

        private void SeedTestData()
        {
            // Add test
            var test = new Test
            {
                Id = 10,
                Name = "TAN Test",
                TestStandId = 1
            };

            // Add equipment
            var equipment = new MAndTEquip
            {
                EquipName = "Thermometer 001",
                EquipType = "THERMOMETER",
                TestId = 10,
                DueDate = DateTime.UtcNow.AddDays(30),
                Exclude = false,
                Val1 = "0.1",
                Val2 = "0.2"
            };

            var overdueEquipment = new MAndTEquip
            {
                EquipName = "Overdue Equipment",
                EquipType = "THERMOMETER",
                TestId = 10,
                DueDate = DateTime.UtcNow.AddDays(-10),
                Exclude = false,
                Val1 = "0.1",
                Val2 = "0.2"
            };

            _context.Tests.Add(test);
            _context.MAndTEquips.Add(equipment);
            _context.MAndTEquips.Add(overdueEquipment);
            _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
