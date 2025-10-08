using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using LabResultsApi.Data;
using LabResultsApi.Services;
using LabResultsApi.DTOs;
using LabResultsApi.Models;
using System.Threading.Tasks;
using System.Linq;

namespace LabResultsApi.Tests.Services
{
    public class UserQualificationServiceTests : IDisposable
    {
        private readonly LabResultsDbContext _context;
        private readonly UserQualificationService _service;
        private readonly Mock<ILogger<UserQualificationService>> _mockLogger;

        public UserQualificationServiceTests()
        {
            var options = new DbContextOptionsBuilder<LabResultsDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new LabResultsDbContext(options);
            _mockLogger = new Mock<ILogger<UserQualificationService>>();
            _service = new UserQualificationService(_context, _mockLogger.Object);

            SeedTestData();
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
            Assert.Equal("Q", result.QualificationLevel);
        }

        [Fact]
        public async Task GetUserQualificationAsync_InvalidEmployee_ReturnsDefaultQualification()
        {
            // Arrange
            var employeeId = "INVALID";
            var testId = (short)10;

            // Act
            var result = await _service.GetUserQualificationAsync(employeeId, testId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(employeeId, result.EmployeeId);
            Assert.Equal(testId, result.TestId);
            Assert.False(result.CanEnter);
            Assert.False(result.CanReview);
        }

        [Fact]
        public async Task GetUserQualificationSummaryAsync_ValidUser_ReturnsSummary()
        {
            // Arrange
            var userId = "TEST001";

            // Act
            var result = await _service.GetUserQualificationSummaryAsync(userId);

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async Task GetQualifiedTestsForUserAsync_ValidUser_ReturnsQualifiedTests()
        {
            // Arrange
            var userId = "TEST001";

            // Act
            var result = await _service.GetQualifiedTestsForUserAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<TestInfoDto>>(result);
        }

        [Fact]
        public async Task GetUnqualifiedTestsForUserAsync_ValidUser_ReturnsUnqualifiedTests()
        {
            // Arrange
            var userId = "TEST001";

            // Act
            var result = await _service.GetUnqualifiedTestsForUserAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<TestInfoDto>>(result);
        }

        [Fact]
        public async Task CanUserPerformActionAsync_ValidUserAndAction_ReturnsTrue()
        {
            // Arrange
            var userId = "TEST001";
            var testId = (short)10;
            var action = "enter";

            // Act
            var result = await _service.CanUserPerformActionAsync(userId, testId, action);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task CanUserPerformActionAsync_InvalidUser_ReturnsFalse()
        {
            // Arrange
            var userId = "INVALID";
            var testId = (short)10;
            var action = "enter";

            // Act
            var result = await _service.CanUserPerformActionAsync(userId, testId, action);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task GetTestStandQualificationsAsync_ValidTestStand_ReturnsQualifications()
        {
            // Arrange
            var testStandId = (short)1;

            // Act
            var result = await _service.GetTestStandQualificationsAsync(testStandId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<UserQualificationDto>>(result);
        }

        [Fact]
        public async Task GetUserTestStandMappingsAsync_ValidUser_ReturnsMappings()
        {
            // Arrange
            var userId = "TEST001";

            // Act
            var result = await _service.GetUserTestStandMappingsAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<object>>(result);
        }

        private void SeedTestData()
        {
            // Add test stand
            var testStand = new TestStand
            {
                Id = 1,
                Name = "Test Stand 1"
            };

            // Add test
            var test = new Test
            {
                Id = 10,
                Name = "TAN Test",
                TestStandId = 1
            };

            // Add user qualification
            var qualification = new LubeTechQualification
            {
                EmployeeId = "TEST001",
                TestStandId = 1,
                QualificationLevel = "Q"
            };

            _context.TestStands.Add(testStand);
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
