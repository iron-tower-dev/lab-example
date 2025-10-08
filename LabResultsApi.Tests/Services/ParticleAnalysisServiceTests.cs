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
    public class ParticleAnalysisServiceTests : IDisposable
    {
        private readonly LabResultsDbContext _context;
        private readonly ParticleAnalysisService _service;
        private readonly Mock<ILogger<ParticleAnalysisService>> _mockLogger;

        public ParticleAnalysisServiceTests()
        {
            var options = new DbContextOptionsBuilder<LabResultsDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new LabResultsDbContext(options);
            _mockLogger = new Mock<ILogger<ParticleAnalysisService>>();
            _service = new ParticleAnalysisService(_context, _mockLogger.Object);

            SeedTestData();
        }

        [Fact]
        public async Task GetParticleAnalysisAsync_ValidSampleAndTest_ReturnsAnalysis()
        {
            // Arrange
            var sampleId = 1;
            var testId = (short)120;

            // Act
            var result = await _service.GetParticleAnalysisAsync(sampleId, testId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(sampleId, result.SampleId);
            Assert.Equal(testId, result.TestId);
        }

        [Fact]
        public async Task SaveParticleAnalysisAsync_ValidData_ReturnsSavedAnalysis()
        {
            // Arrange
            var analysisDto = new ParticleAnalysisDto
            {
                SampleId = 1,
                TestId = 120,
                ParticleTypes = new List<ParticleTypeDto>
                {
                    new ParticleTypeDto
                    {
                        ParticleTypeDefinitionId = 1,
                        Type = "METALLIC",
                        Description = "Metallic particles",
                        Status = "1",
                        Comments = "Test comment",
                        SubTypes = new List<ParticleSubTypeDto>()
                    }
                },
                AnalysisDate = DateTime.Now,
                OverallSeverity = "2"
            };

            // Act
            var result = await _service.SaveParticleAnalysisAsync(analysisDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(analysisDto.SampleId, result.SampleId);
            Assert.Equal(analysisDto.TestId, result.TestId);
        }

        [Fact]
        public async Task GetParticleTypesAsync_ValidSampleAndTest_ReturnsParticleTypes()
        {
            // Arrange
            var sampleId = 1;
            var testId = (short)120;

            // Act
            var result = await _service.GetParticleTypesAsync(sampleId, testId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<ParticleTypeDto>>(result);
        }

        [Fact]
        public async Task SaveParticleTypesAsync_ValidData_ReturnsTrue()
        {
            // Arrange
            var sampleId = 1;
            var testId = (short)120;
            var particleTypes = new List<ParticleTypeDto>
            {
                new ParticleTypeDto
                {
                    ParticleTypeDefinitionId = 1,
                    Type = "METALLIC",
                    Description = "Metallic particles",
                    Status = "1",
                    Comments = "Test comment",
                    SubTypes = new List<ParticleSubTypeDto>()
                }
            };

            // Act
            var result = await _service.SaveParticleTypesAsync(sampleId, testId, particleTypes);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task GetParticleTypeCategoriesAsync_ReturnsCategories()
        {
            // Act
            var result = await _service.GetParticleTypeCategoriesAsync();

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<ParticleTypeCategoryDto>>(result);
        }

        [Fact]
        public async Task GetParticleSubTypeDefinitionsAsync_ReturnsSubTypeDefinitions()
        {
            // Act
            var result = await _service.GetParticleSubTypeDefinitionsAsync();

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<ParticleSubTypeDefinitionDto>>(result);
        }

        private void SeedTestData()
        {
            // Add particle type definition
            var particleTypeDefinition = new ParticleTypeDefinition
            {
                Id = 1,
                Type = "METALLIC",
                Description = "Metallic particles"
            };

            // Add particle type category
            var particleTypeCategory = new ParticleSubTypeCategoryDefinition
            {
                Id = 1,
                Description = "Metallic Category",
                SortOrder = 1
            };

            // Add particle subtype definition
            var particleSubTypeDefinition = new ParticleSubTypeDefinition
            {
                Id = 1,
                ParticleSubTypeCategoryId = 1,
                Value = "IRON",
                Description = "Iron particles",
                SortOrder = 1
            };

            _context.ParticleTypeDefinitions.Add(particleTypeDefinition);
            _context.ParticleSubTypeCategoryDefinitions.Add(particleTypeCategory);
            _context.ParticleSubTypeDefinitions.Add(particleSubTypeDefinition);
            _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
