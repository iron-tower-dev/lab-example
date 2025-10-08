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
    public class TestResultServiceTests : IDisposable
    {
        private readonly LabResultsDbContext _context;
        private readonly TestResultService _service;
        private readonly Mock<ILogger<TestResultService>> _mockLogger;

        public TestResultServiceTests()
        {
            var options = new DbContextOptionsBuilder<LabResultsDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new LabResultsDbContext(options);
            _mockLogger = new Mock<ILogger<TestResultService>>();
            _service = new TestResultService(_context, _mockLogger.Object);

            SeedTestData();
        }

        [Fact]
        public async Task GetSampleInfoAsync_ValidSampleId_ReturnsSampleInfo()
        {
            // Arrange
            var sampleId = 1;

            // Act
            var result = await _service.GetSampleInfoAsync(sampleId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(sampleId, result.SampleId);
            Assert.Equal("TEST001", result.TagNumber);
        }

        [Fact]
        public async Task GetSampleInfoAsync_InvalidSampleId_ReturnsNull()
        {
            // Arrange
            var sampleId = 999;

            // Act
            var result = await _service.GetSampleInfoAsync(sampleId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetTestInfoAsync_ValidTestId_ReturnsTestInfo()
        {
            // Arrange
            var testId = (short)10;

            // Act
            var result = await _service.GetTestInfoAsync(testId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(testId, result.Id);
            Assert.Equal("TAN Test", result.Name);
        }

        [Fact]
        public async Task GetTestInfoAsync_InvalidTestId_ReturnsNull()
        {
            // Arrange
            var testId = (short)999;

            // Act
            var result = await _service.GetTestInfoAsync(testId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task SaveTanTestAsync_ValidData_ReturnsTestResult()
        {
            // Arrange
            var tanTestDto = new TanTestDto
            {
                SampleId = 1,
                TestId = 10,
                TrialNumber = 1,
                SampleWeight = 1.5,
                FinalBuret = 2.5,
                TanCalculated = 0.94,
                EquipmentId = "EQ001",
                Status = "S",
                Comments = "Test comment"
            };

            // Act
            var result = await _service.SaveTanTestAsync(tanTestDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(tanTestDto.SampleId, result.SampleId);
            Assert.Equal(tanTestDto.TestId, result.TestId);
            Assert.Equal(tanTestDto.TrialNumber, result.TrialNumber);
        }

        [Fact]
        public async Task GetTestResultsAsync_ValidSampleAndTest_ReturnsResults()
        {
            // Arrange
            var sampleId = 1;
            var testId = (short)10;

            // Act
            var result = await _service.GetTestResultsAsync(sampleId, testId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<TestResultEntryDto>>(result);
        }

        [Fact]
        public async Task SaveTestResultsAsync_ValidData_ReturnsSuccessResponse()
        {
            // Arrange
            var saveDto = new TestResultSaveDto
            {
                SampleId = 1,
                TestId = 10,
                TrialNumber = 1,
                Value1 = "1.5",
                Value2 = "2.5",
                Value3 = "0.94",
                Status = "S",
                MainComments = "Test comment"
            };
            var employeeId = "TEST001";

            // Act
            var result = await _service.SaveTestResultsAsync(saveDto, employeeId);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Success);
            Assert.Equal(saveDto.SampleId, result.SampleId);
            Assert.Equal(saveDto.TestId, result.TestId);
        }

        [Fact]
        public async Task ValidateTestResultsAsync_ValidData_ReturnsTrue()
        {
            // Arrange
            var saveDto = new TestResultSaveDto
            {
                SampleId = 1,
                TestId = 10,
                TrialNumber = 1,
                Value1 = "1.5",
                Value2 = "2.5",
                Value3 = "0.94",
                Status = "S"
            };
            var employeeId = "TEST001";

            // Act
            var result = await _service.ValidateTestResultsAsync(saveDto, employeeId);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task GetUserQualificationAsync_ValidEmployeeAndTest_ReturnsQualification()
        {
            // Arrange
            var employeeId = "TEST001";
            var testId = (short)10;

            // Act
            var result = await _service.GetUserQualificationAsync(employeeId, testId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(employeeId, result.EmployeeId);
            Assert.Equal(testId, result.TestId);
        }

        [Fact]
        public async Task GetTestStatusAsync_ValidSampleAndTest_ReturnsStatus()
        {
            // Arrange
            var sampleId = 1;
            var testId = (short)10;

            // Act
            var result = await _service.GetTestStatusAsync(sampleId, testId);

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async Task UpdateTestStatusAsync_ValidData_ReturnsTrue()
        {
            // Arrange
            var updateDto = new TestStatusUpdateDto
            {
                SampleId = 1,
                TestId = 10,
                NewStatus = "S",
                Comments = "Status updated",
                EmployeeId = "TEST001"
            };

            // Act
            var result = await _service.UpdateTestStatusAsync(updateDto);

            // Assert
            Assert.True(result);
        }

        private void SeedTestData()
        {
            // Add sample data for testing
            var sample = new UsedLubeSample
            {
                Id = 1,
                TagNumber = "TEST001",
                Component = "COMP001",
                Location = "LOC001",
                LubeType = "HYDRAULIC",
                NewUsedFlag = 1
            };

            var test = new Test
            {
                Id = 10,
                Name = "TAN Test",
                TestStandId = 1
            };

            var qualification = new LubeTechQualification
            {
                EmployeeId = "TEST001",
                TestStandId = 1,
                QualificationLevel = "Q"
            };

            _context.UsedLubeSamples.Add(sample);
            _context.Tests.Add(test);
            _context.LubeTechQualifications.Add(qualification);
            _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
