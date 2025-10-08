using Microsoft.EntityFrameworkCore;
using LabResultsApi.Data;
using LabResultsApi.Services;
using LabResultsApi.Middleware;
using LabResultsApi.Endpoints;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { 
        Title = "Lab Results API", 
        Version = "v1",
        Description = "A modern .NET 8 Web API for laboratory test result management, replacing the legacy VB ASP.NET application."
    });
});

// Database
builder.Services.AddDbContext<LabResultsDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Services
builder.Services.AddScoped<ITestResultService, TestResultService>();
builder.Services.AddScoped<IUserQualificationService, UserQualificationService>();
builder.Services.AddScoped<IEquipmentService, EquipmentService>();
builder.Services.AddScoped<IParticleAnalysisService, ParticleAnalysisService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// JSON Serialization
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
    options.SerializerOptions.PropertyNamingPolicy = null;
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Lab Results API v1");
        c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowAngularApp");

// Custom middleware
app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseAuthorization();

// Map organized endpoint groups
app.MapTestResultsEndpoints();
app.MapSampleEndpoints();
app.MapTestEndpoints();
app.MapUserQualificationEndpoints();
app.MapEquipmentEndpoints();
app.MapParticleAnalysisEndpoints();
app.MapStatusManagementEndpoints();

app.Run();
