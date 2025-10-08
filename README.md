# Laboratory Results Management System

A modern Angular 20 frontend with .NET 8 Web API backend for laboratory test result entry and management.

## Overview

This project modernizes a legacy VB ASP.NET laboratory results entry system into a contemporary, maintainable, and scalable application. The system handles multiple test types, user qualifications, equipment tracking, and complex particle analysis workflows.

## Features

- **Multiple Test Types**: TAN, Viscosity, FTIR, Particle Analysis, and more
- **User Role Management**: Different qualification levels (Q/QAG, MicrE, TRAIN)
- **Dynamic Forms**: Test-specific entry forms with real-time validation
- **Equipment Tracking**: M&TE (Measurement & Test Equipment) management
- **Particle Analysis**: Sophisticated particle type characterization
- **Workflow Management**: Status tracking, partial saves, review/approval processes
- **Responsive Design**: Mobile-friendly interface using Angular Material

## Technology Stack

### Backend
- .NET 8 Web API
- Entity Framework Core 8
- SQL Server
- Swagger/OpenAPI

### Frontend
- Angular 20
- Angular Material
- TypeScript
- RxJS
- Angular Signals

## Project Structure

```
├── LabResultsApi/                 # .NET 8 Web API Backend
│   ├── Controllers/              # API Controllers
│   ├── Services/                 # Business Logic Services
│   ├── Models/                   # Entity Framework Models
│   ├── DTOs/                     # Data Transfer Objects
│   ├── Data/                     # Database Context
│   └── Middleware/               # Custom Middleware
├── lab-results-app/              # Angular 20 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/       # Angular Components
│   │   │   ├── services/         # Angular Services
│   │   │   ├── models/           # TypeScript Models
│   │   │   └── app.routes.ts     # Routing Configuration
│   │   └── main.ts               # Application Bootstrap
└── docs/                         # Documentation
```

## Prerequisites

- .NET 8 SDK
- Node.js 18+ and npm
- SQL Server (LocalDB or full instance)
- Visual Studio 2022 or VS Code

## Getting Started

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lab-results-system
   ```

2. **Navigate to the API project**
   ```bash
   cd LabResultsApi
   ```

3. **Update connection string**
   Edit `appsettings.json` to point to your SQL Server instance:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=LabResultsDb;Trusted_Connection=true;MultipleActiveResultSets=true"
     }
   }
   ```

4. **Install dependencies and run**
   ```bash
   dotnet restore
   dotnet ef database update
   dotnet run
   ```

   The API will be available at `https://localhost:7001`

### Frontend Setup

1. **Navigate to the Angular project**
   ```bash
   cd lab-results-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:4200`

## API Documentation

Once the backend is running, you can access the Swagger documentation at:
`https://localhost:7001/swagger`

## Key Components

### Test Result Entry
- **TestResultEntryComponent**: Main test entry form with dynamic field rendering
- **TanEntryComponent**: TAN (Total Acid Number) specific entry form
- **ViscosityEntryComponent**: Viscosity test entry with equipment selection
- **ParticleAnalysisComponent**: Complex particle analysis interface

### Services
- **TestResultService**: API communication and business logic
- **UserQualificationService**: User permission management
- **EquipmentService**: Equipment and M&TE management
- **ParticleAnalysisService**: Particle type and subtype management

## Database Schema

The system uses the existing SQL Server database with the following key tables:

- **TestReadings**: Main test results storage
- **Tests**: Test definitions and metadata
- **UsedLubeSamples**: Sample information
- **ParticleType**: Particle analysis data
- **FTIR**: FTIR test results
- **EmSpectro**: Elemental spectroscopy results
- **MAndTEquip**: Measurement and test equipment

## Development Guidelines

### Backend Development
- Follow .NET 8 best practices
- Use Entity Framework Core for data access
- Implement proper error handling and logging
- Write unit tests for services
- Use DTOs for API communication

### Frontend Development
- Use Angular 20 standalone components
- Follow Angular Material design principles
- Implement reactive forms with validation
- Use Angular Signals for state management
- Write component and service tests

## Testing

### Backend Testing
```bash
cd LabResultsApi
dotnet test
```

### Frontend Testing
```bash
cd lab-results-app
npm test
```

## Deployment

### Backend Deployment
1. Build the application:
   ```bash
   dotnet publish -c Release
   ```

2. Deploy to IIS or Azure App Service

### Frontend Deployment
1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to a web server or Azure Static Web Apps

## Configuration

### Environment Variables
- **API_URL**: Backend API URL (default: https://localhost:7001)
- **EMPLOYEE_ID**: Default employee ID for testing

### Database Configuration
Update the connection string in `appsettings.json` for different environments.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the API CORS policy allows the frontend URL
2. **Database Connection**: Verify SQL Server is running and connection string is correct
3. **Port Conflicts**: Change ports in `launchSettings.json` if needed

### Logs
- Backend logs: Check console output or Application Insights
- Frontend logs: Check browser developer tools console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Roadmap

- [ ] Authentication and authorization implementation
- [ ] Advanced reporting features
- [ ] Mobile app development
- [ ] Integration with external systems
- [ ] Performance optimization
- [ ] Additional test types

---

**Version**: 1.0.0  
**Last Updated**: January 2024
