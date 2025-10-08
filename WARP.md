# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Laboratory Results Management System that modernizes a legacy VB ASP.NET application into an Angular 20 frontend with .NET 8 Web API backend. The system handles laboratory test result entry with multiple test types, user qualifications, equipment tracking, and complex particle analysis workflows.

## Architecture

**Full-stack application structure:**
- **Backend**: .NET 8 Web API with Entity Framework Core 8 and SQL Server
- **Frontend**: Angular 20 with standalone components, Angular Material, and TypeScript
- **API Pattern**: Minimal APIs with endpoint groups and service layer architecture
- **Database**: Existing SQL Server database with Entity Framework Code-First approach

**Key architectural patterns:**
- Service layer with dependency injection for business logic
- DTO pattern for API data transfer
- Repository pattern via Entity Framework DbContext
- Angular standalone components with lazy loading
- Signal-based reactive state management

## Development Commands

### Backend (.NET 8 API)
```bash
# Navigate to API project
cd LabResultsApi

# Restore dependencies
dotnet restore

# Run database migrations
dotnet ef database update

# Run the API (will start on https://localhost:7001)
dotnet run

# Run tests
cd ../LabResultsApi.Tests
dotnet test

# Build for release
dotnet publish -c Release
```

### Frontend (Angular 20)
```bash
# Navigate to Angular project
cd lab-results-app

# Install dependencies
npm install

# Start development server (http://localhost:4200)
npm start
# or
ng serve

# Run tests
npm test
# or
ng test

# Run linter
npm run lint
# or  
ng lint

# Build for production
npm run build
# or
ng build

# Watch mode for development
npm run watch
# or
ng build --watch --configuration development
```

### Full Stack Development
```bash
# Start both backend and frontend (run in separate terminals)
# Terminal 1:
cd LabResultsApi && dotnet run

# Terminal 2: 
cd lab-results-app && npm start
```

## API Architecture

The API uses .NET 8 minimal APIs organized into endpoint groups:

**Endpoint Groups (in Program.cs):**
- `TestResultsEndpoints` - Main test result CRUD operations
- `SampleEndpoints` - Sample information management
- `TestEndpoints` - Test definitions and metadata  
- `UserQualificationEndpoints` - User permission checks
- `EquipmentEndpoints` - M&TE equipment management
- `ParticleAnalysisEndpoints` - Particle type analysis
- `StatusManagementEndpoints` - Workflow status management

**Service Layer:**
- `ITestResultService` - Core test result business logic
- `IUserQualificationService` - User permission validation
- `IEquipmentService` - Equipment and M&TE management
- `IParticleAnalysisService` - Particle analysis workflows

**Data Layer:**
- `LabResultsDbContext` - Entity Framework context
- DTOs for all test types (TAN, Viscosity, FTIR, Particle Analysis, etc.)

## Frontend Architecture

**Angular 20 Features Used:**
- Standalone components (no modules)
- Lazy-loaded routes with dynamic imports
- Angular Signals for reactive state management
- Angular Material for UI components
- Reactive Forms for complex form handling

**Key Components:**
- `TestResultEntryComponent` - Dynamic test entry forms
- `TanEntryComponent`, `ViscosityEntryComponent` - Test-specific forms
- `ParticleAnalysisComponent` - Complex particle type interface
- `EquipmentComponent` - M&TE equipment management
- `DashboardComponent` - Main navigation and overview

**Services:**
- `TestResultService` - API communication and caching
- `UserQualificationService` - Permission management  
- `EquipmentService` - Equipment data management
- `ParticleAnalysisService` - Particle type operations

## Database Context

**Primary Tables:**
- `TestReadings` - Main test results (composite key: SampleId, TestId, TrialNumber)
- `Tests` - Test definitions and metadata
- `UsedLubeSamples` - Sample information
- `ParticleType` - Particle analysis data
- `FTIR`, `EmSpectro` - Specialized test result tables
- `MAndTEquip` - Measurement & Test Equipment

**Key Relationships:**
- TestReadings → Tests (many-to-one)
- TestReadings → UsedLubeSamples (many-to-one)
- ParticleType → TestReadings (many-to-one)

## Development Patterns

**Backend Conventions:**
- Service interfaces with dependency injection
- DTO classes for all API responses
- Endpoint groups for organization
- Error handling middleware
- Entity Framework for data access

**Frontend Conventions:**
- Standalone components with explicit imports
- Signal-based state management over traditional observables where appropriate
- Angular Material for consistent UI
- TypeScript interfaces matching API DTOs
- Lazy loading for performance

**Test Types Supported:**
The system handles 20+ specialized laboratory tests including TAN (Total Acid Number), Viscosity, FTIR, Particle Analysis, Emission Spectroscopy, Flash Point, Grease Penetration, Oxidation Stability, and more. Each test type has its own DTO, component, and business logic.

## Configuration

**Backend Configuration:**
- Connection string in `appsettings.json` (default: LocalDB)
- CORS configured for Angular frontend (localhost:4200)  
- Swagger UI available at API root when running in development
- JSON serialization configured for enum handling

**Frontend Configuration:**
- API base URL: https://localhost:7001 (backend)
- Angular Material theme configuration
- HTTP interceptors for error handling
- Route-based lazy loading configuration

## Testing Strategy

**Backend Testing:**
- xUnit for unit tests
- Moq for mocking dependencies
- Entity Framework InMemory for database testing
- Service layer unit tests for business logic

**Frontend Testing:**
- Jasmine/Karma for unit tests
- Component testing with Angular Testing utilities
- Service testing with HTTP mocking
- End-to-end testing setup available

## Common Development Tasks

**Adding a New Test Type:**
1. Create DTO class in `LabResultsApi/DTOs/`
2. Add service methods in appropriate service class
3. Create endpoint in relevant endpoint group
4. Add Angular component in `lab-results-app/src/app/components/`
5. Update routing configuration
6. Add corresponding TypeScript interface

**Database Changes:**
1. Update Entity Framework models
2. Create migration: `dotnet ef migrations add <MigrationName>`
3. Apply migration: `dotnet ef database update`

**API Endpoint Testing:**
- Swagger UI available at https://localhost:7001 when API is running
- All endpoints documented with OpenAPI specifications