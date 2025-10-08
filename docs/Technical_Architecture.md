# Lab Results Management System - Technical Architecture

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Patterns](#architecture-patterns)
3. [Component Design](#component-design)
4. [Data Flow](#data-flow)
5. [API Design Patterns](#api-design-patterns)
6. [Frontend Architecture](#frontend-architecture)
7. [Backend Architecture](#backend-architecture)
8. [Database Architecture](#database-architecture)
9. [Security Architecture](#security-architecture)
10. [Performance Considerations](#performance-considerations)
11. [Scalability Design](#scalability-design)
12. [Monitoring and Logging](#monitoring-and-logging)

## System Overview

The Lab Results Management System is a modern web application built with Angular 20 frontend and .NET 8 Web API backend, designed to replace a legacy VB ASP.NET application while maintaining 100% functional parity.

### System Characteristics
- **Type**: Web Application
- **Architecture**: Client-Server with RESTful API
- **Deployment**: Cloud-native (Azure)
- **Scalability**: Horizontal scaling
- **Availability**: 99.9% uptime target

## Architecture Patterns

### 1. Layered Architecture
```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│         (Angular Components)        │
├─────────────────────────────────────┤
│            Service Layer            │
│        (Angular Services)           │
├─────────────────────────────────────┤
│            API Layer                │
│        (.NET Minimal APIs)          │
├─────────────────────────────────────┤
│          Business Layer             │
│        (Service Classes)            │
├─────────────────────────────────────┤
│           Data Access Layer         │
│      (Entity Framework Core)        │
├─────────────────────────────────────┤
│           Database Layer            │
│         (SQL Server)                │
└─────────────────────────────────────┘
```

### 2. Domain-Driven Design (DDD)
- **Aggregates**: TestResult, Sample, User, Equipment, ParticleAnalysis
- **Value Objects**: TestId, SampleId, EmployeeId
- **Domain Services**: ValidationService, QualificationService
- **Repositories**: TestResultRepository, SampleRepository

### 3. CQRS (Command Query Responsibility Segregation)
- **Commands**: SaveTestResult, UpdateTestStatus, CreateSample
- **Queries**: GetTestResults, GetSampleInfo, GetUserQualification
- **Handlers**: CommandHandlers, QueryHandlers

## Component Design

### Frontend Components

#### 1. Test Entry Components
```typescript
// Base test entry component
@Component({
  selector: 'app-test-entry',
  template: '...',
  standalone: true
})
export class TestEntryComponent {
  @Input() sampleId!: number;
  @Input() testId!: number;
  @Output() saved = new EventEmitter<TestResultDto>();
  @Output() cleared = new EventEmitter<void>();
}

// Specific test components
@Component({...})
export class TanEntryComponent extends TestEntryComponent {...}

@Component({...})
export class ViscosityEntryComponent extends TestEntryComponent {...}
```

#### 2. Service Layer
```typescript
@Injectable({ providedIn: 'root' })
export class TestResultService {
  private readonly http = inject(HttpClient);
  private readonly validationService = inject(ValidationService);
  
  saveTestResult(dto: TestResultDto): Observable<TestResultDto> {
    // Validation and API call
  }
}

@Injectable({ providedIn: 'root' })
export class ValidationService {
  validateTestResult(testId: number, data: any): ValidationResult {
    // Comprehensive validation logic
  }
}
```

### Backend Components

#### 1. Minimal API Endpoints
```csharp
public static class TestResultsEndpoints
{
    public static void MapTestResultsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/test-results")
                       .WithTags("Test Results");

        group.MapGet("/{sampleId:int}/{testId:short}", 
            async (int sampleId, short testId, ITestResultService service) =>
            {
                var results = await service.GetTestResultsAsync(sampleId, testId);
                return Results.Ok(results);
            })
            .WithName("GetTestResults")
            .Produces<List<TestResultEntryDto>>(200);
    }
}
```

#### 2. Service Layer
```csharp
public interface ITestResultService
{
    Task<TestResultResponseDto> SaveTestResultsAsync(TestResultSaveDto saveDto, string employeeId);
    Task<List<TestResultEntryDto>> GetTestResultsAsync(int sampleId, short testId);
    Task<TestResultEntryDto> SaveTanTestAsync(TanTestDto dto);
    // ... other methods
}

public class TestResultService : ITestResultService
{
    private readonly LabResultsDbContext _context;
    private readonly ILogger<TestResultService> _logger;

    public async Task<TestResultResponseDto> SaveTestResultsAsync(TestResultSaveDto saveDto, string employeeId)
    {
        // Business logic implementation
    }
}
```

## Data Flow

### 1. Test Result Entry Flow
```
User Input → Angular Component → Validation Service → API Service → 
.NET API → Business Service → Data Access → Database
```

### 2. Data Retrieval Flow
```
User Request → Angular Component → API Service → .NET API → 
Business Service → Data Access → Database → Response Chain
```

### 3. Validation Flow
```
Input Data → Client Validation → Server Validation → Business Rules → 
Database Constraints → Response
```

## API Design Patterns

### 1. RESTful Design
- **Resources**: Tests, Samples, Users, Equipment, ParticleAnalysis
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: 200, 201, 400, 404, 500
- **Content Type**: application/json

### 2. Endpoint Organization
```csharp
// Organized by domain
/api/test-results/*     // Test result operations
/api/samples/*          // Sample operations
/api/tests/*            // Test operations
/api/user-qualifications/* // User qualification operations
/api/equipment/*        // Equipment operations
/api/particle-analysis/* // Particle analysis operations
/api/status-management/* // Status management operations
```

### 3. Response Patterns
```csharp
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}

// Error Response
{
  "success": false,
  "errors": ["Error message 1", "Error message 2"],
  "message": "Operation failed"
}
```

## Frontend Architecture

### 1. Component Architecture
```
AppComponent
├── HeaderComponent
├── NavigationComponent
├── TestEntryContainerComponent
│   ├── TanEntryComponent
│   ├── ViscosityEntryComponent
│   ├── FlashPointEntryComponent
│   └── ... (other test components)
├── SampleInfoComponent
├── EquipmentSelectorComponent
└── ParticleAnalysisComponent
```

### 2. State Management
```typescript
// Using Angular Signals
export class TestEntryComponent {
  private readonly testData = signal<TestResultDto | null>(null);
  private readonly isLoading = signal(false);
  private readonly errors = signal<string[]>([]);

  // Computed signals
  readonly isValid = computed(() => 
    this.testData() !== null && this.errors().length === 0
  );
}
```

### 3. Service Architecture
```typescript
// Core services
TestResultService      // API communication
ValidationService      // Client-side validation
UserQualificationService // User permissions
EquipmentService       // Equipment management
StatusManagementService // Status workflow

// Utility services
NotificationService    // User notifications
ErrorHandlingService   // Error management
LoggingService         // Client-side logging
```

## Backend Architecture

### 1. Service Layer Architecture
```csharp
// Interface segregation
ITestResultService
IUserQualificationService
IEquipmentService
IParticleAnalysisService
IStatusManagementService

// Implementation classes
TestResultService : ITestResultService
UserQualificationService : IUserQualificationService
EquipmentService : IEquipmentService
ParticleAnalysisService : IParticleAnalysisService
StatusManagementService : IStatusManagementService
```

### 2. Data Access Pattern
```csharp
// Repository pattern with Entity Framework Core
public class TestResultRepository
{
    private readonly LabResultsDbContext _context;

    public async Task<TestResult> GetByIdAsync(int id)
    {
        return await _context.TestResults
            .Include(tr => tr.Sample)
            .Include(tr => tr.Test)
            .FirstOrDefaultAsync(tr => tr.Id == id);
    }
}
```

### 3. Dependency Injection
```csharp
// Service registration
builder.Services.AddScoped<ITestResultService, TestResultService>();
builder.Services.AddScoped<IUserQualificationService, UserQualificationService>();
builder.Services.AddScoped<IEquipmentService, EquipmentService>();
builder.Services.AddScoped<IParticleAnalysisService, ParticleAnalysisService>();
builder.Services.AddScoped<IStatusManagementService, StatusManagementService>();
```

## Database Architecture

### 1. Entity Framework Core Configuration
```csharp
public class LabResultsDbContext : DbContext
{
    public DbSet<UsedLubeSample> UsedLubeSamples { get; set; }
    public DbSet<TestReading> TestReadings { get; set; }
    public DbSet<Test> Tests { get; set; }
    public DbSet<LubeTechQualification> LubeTechQualifications { get; set; }
    public DbSet<MAndTEquip> MAndTEquips { get; set; }
    public DbSet<ParticleType> ParticleTypes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Entity configurations
        modelBuilder.Entity<TestReading>(entity =>
        {
            entity.HasKey(e => new { e.SampleId, e.TestId, e.TrialNumber });
        });
    }
}
```

### 2. Connection Management
```csharp
// Connection string configuration
builder.Services.AddDbContext<LabResultsDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null);
    }));
```

### 3. Query Optimization
```csharp
// Efficient querying with includes
public async Task<List<TestResultEntryDto>> GetTestResultsAsync(int sampleId, short testId)
{
    return await _context.TestReadings
        .Where(tr => tr.SampleId == sampleId && tr.TestId == testId)
        .Include(tr => tr.Sample)
        .Include(tr => tr.Test)
        .Select(tr => new TestResultEntryDto
        {
            SampleId = tr.SampleId,
            TestId = tr.TestId,
            TrialNumber = tr.TrialNumber,
            Value1 = tr.Value1,
            Value2 = tr.Value2,
            Value3 = tr.Value3,
            Status = tr.Status,
            EntryDate = tr.EntryDate
        })
        .ToListAsync();
}
```

## Security Architecture

### 1. Authentication
```csharp
// Header-based authentication
public class EmployeeIdAuthenticationMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var employeeId = context.Request.Headers["X-Employee-Id"].FirstOrDefault();
        
        if (string.IsNullOrEmpty(employeeId))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Employee ID required");
            return;
        }

        // Validate employee ID against database
        var isValid = await ValidateEmployeeIdAsync(employeeId);
        if (!isValid)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Invalid employee ID");
            return;
        }

        context.Items["EmployeeId"] = employeeId;
        await next(context);
    }
}
```

### 2. Authorization
```csharp
// Role-based authorization
public class TestResultService
{
    public async Task<TestResultResponseDto> SaveTestResultsAsync(TestResultSaveDto saveDto, string employeeId)
    {
        // Check user qualification
        var qualification = await _userQualificationService.GetUserQualificationAsync(employeeId, saveDto.TestId);
        
        if (!qualification.CanEnter)
        {
            return new TestResultResponseDto
            {
                Success = false,
                Message = "User not qualified to enter results for this test",
                Errors = new List<string> { "Insufficient qualification level" }
            };
        }

        // Proceed with save operation
    }
}
```

### 3. Input Validation
```csharp
// Comprehensive input validation
public class TestResultSaveDto
{
    [Required]
    public int SampleId { get; set; }
    
    [Required]
    public short TestId { get; set; }
    
    [Range(1, 4)]
    public short TrialNumber { get; set; } = 1;
    
    [StringLength(50)]
    public string? Value1 { get; set; }
    
    [StringLength(50)]
    public string? Value2 { get; set; }
    
    [StringLength(50)]
    public string? Value3 { get; set; }
    
    [StringLength(1000)]
    public string? MainComments { get; set; }
}
```

## Performance Considerations

### 1. Caching Strategy
```csharp
// Memory caching for frequently accessed data
builder.Services.AddMemoryCache();

public class TestResultService
{
    private readonly IMemoryCache _cache;
    
    public async Task<TestInfoDto?> GetTestInfoAsync(short testId)
    {
        var cacheKey = $"test_info_{testId}";
        
        if (_cache.TryGetValue(cacheKey, out TestInfoDto? cachedTest))
        {
            return cachedTest;
        }

        var test = await _context.Tests.FindAsync(testId);
        if (test != null)
        {
            var testDto = new TestInfoDto
            {
                Id = test.Id,
                Name = test.Name,
                Description = test.Description,
                IsActive = test.Active,
                TestStandId = test.TestStandId
            };

            _cache.Set(cacheKey, testDto, TimeSpan.FromMinutes(30));
            return testDto;
        }

        return null;
    }
}
```

### 2. Database Optimization
```csharp
// Efficient querying with proper indexing
public async Task<List<TestResultEntryDto>> GetTestResultsAsync(int sampleId, short testId)
{
    return await _context.TestReadings
        .Where(tr => tr.SampleId == sampleId && tr.TestId == testId)
        .AsNoTracking() // Read-only queries
        .Select(tr => new TestResultEntryDto
        {
            // Projection to avoid loading full entities
        })
        .ToListAsync();
}
```

### 3. Response Compression
```csharp
// Enable response compression
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<GzipCompressionProvider>();
});

app.UseResponseCompression();
```

## Scalability Design

### 1. Horizontal Scaling
```csharp
// Stateless API design for horizontal scaling
public class TestResultService
{
    // No static state or in-memory caching of user data
    // All state stored in database
    // Session management through database
}
```

### 2. Load Balancing
```csharp
// Health checks for load balancer
builder.Services.AddHealthChecks()
    .AddDbContextCheck<LabResultsDbContext>()
    .AddCheck<DatabaseHealthCheck>("database");

app.MapHealthChecks("/health");
```

### 3. Database Scaling
```csharp
// Connection pooling and read replicas
builder.Services.AddDbContext<LabResultsDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure();
        sqlOptions.CommandTimeout(30);
    }));

// Read-only context for queries
builder.Services.AddDbContext<LabResultsReadOnlyDbContext>(options =>
    options.UseSqlServer(readOnlyConnectionString));
```

## Monitoring and Logging

### 1. Structured Logging
```csharp
// Structured logging with Serilog
builder.Services.AddSerilog((services, lc) => lc
    .ReadFrom.Configuration(builder.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/lab-results-.txt", rollingInterval: RollingInterval.Day));

public class TestResultService
{
    private readonly ILogger<TestResultService> _logger;

    public async Task<TestResultResponseDto> SaveTestResultsAsync(TestResultSaveDto saveDto, string employeeId)
    {
        _logger.LogInformation("Saving test results for sample {SampleId}, test {TestId} by employee {EmployeeId}",
            saveDto.SampleId, saveDto.TestId, employeeId);

        try
        {
            // Save logic
            _logger.LogInformation("Successfully saved test results for sample {SampleId}, test {TestId}",
                saveDto.SampleId, saveDto.TestId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save test results for sample {SampleId}, test {TestId}",
                saveDto.SampleId, saveDto.TestId);
            throw;
        }
    }
}
```

### 2. Application Insights
```csharp
// Application Insights integration
builder.Services.AddApplicationInsightsTelemetry();

// Custom telemetry
public class TestResultService
{
    private readonly TelemetryClient _telemetryClient;

    public async Task<TestResultResponseDto> SaveTestResultsAsync(TestResultSaveDto saveDto, string employeeId)
    {
        using var activity = _telemetryClient.StartActivity("SaveTestResults");
        activity?.SetTag("sampleId", saveDto.SampleId);
        activity?.SetTag("testId", saveDto.TestId);
        activity?.SetTag("employeeId", employeeId);

        // Save logic
    }
}
```

### 3. Performance Monitoring
```csharp
// Performance counters
public class TestResultService
{
    private readonly IMetrics _metrics;

    public async Task<TestResultResponseDto> SaveTestResultsAsync(TestResultSaveDto saveDto, string employeeId)
    {
        using var timer = _metrics.Measure.Timer.Time("test_result_save_duration");
        
        // Save logic
        
        _metrics.Measure.Counter.Increment("test_result_save_count");
    }
}
```

## Conclusion

This technical architecture provides a robust, scalable, and maintainable foundation for the Lab Results Management System. The design emphasizes:

1. **Separation of Concerns**: Clear separation between presentation, business, and data layers
2. **Scalability**: Horizontal scaling capabilities with stateless design
3. **Performance**: Optimized database queries and caching strategies
4. **Security**: Comprehensive authentication, authorization, and validation
5. **Maintainability**: Clean code architecture with dependency injection
6. **Monitoring**: Comprehensive logging and telemetry for operational visibility

The architecture supports the system's requirements while providing flexibility for future enhancements and scaling needs.
