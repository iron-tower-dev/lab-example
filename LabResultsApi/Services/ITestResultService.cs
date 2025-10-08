using LabResultsApi.DTOs;

namespace LabResultsApi.Services;

public interface ITestResultService
{
    // General test result operations
    Task<SampleInfoDto?> GetSampleInfoAsync(int sampleId);
    Task<TestInfoDto?> GetTestInfoAsync(short testId);
    Task<UserQualificationDto> GetUserQualificationAsync(string employeeId, short testId);
    Task<List<TestResultEntryDto>> GetTestResultsAsync(int sampleId, short testId);
    Task<TestResultResponseDto> SaveTestResultsAsync(TestResultSaveDto saveDto, string employeeId);
    Task<bool> ValidateTestResultsAsync(TestResultSaveDto saveDto, string employeeId);
    Task<List<ParticleTypeDto>> GetParticleTypesAsync(int sampleId, short testId);
    Task<bool> SaveParticleTypesAsync(int sampleId, short testId, List<ParticleTypeDto> particleTypes);
    
    // CRUD operations
    Task<TestResultEntryDto> SaveTestResultAsync(TestResultEntryDto dto);
    Task<TestResultEntryDto> UpdateTestResultAsync(int sampleId, int testId, TestResultEntryDto dto);
    Task DeleteTestResultAsync(int sampleId, int testId);
    
    // Test-specific save methods
    Task<TestResultEntryDto> SaveTanTestAsync(TanTestDto dto);
    Task<TestResultEntryDto> SaveEmissionSpectroTestAsync(EmissionSpectroDto dto);
    Task<TestResultEntryDto> SaveViscosityTestAsync(ViscosityTestDto dto);
    Task<TestResultEntryDto> SaveFtirTestAsync(FtirTestDto dto);
    Task<TestResultEntryDto> SaveFlashPointTestAsync(FlashPointTestDto dto);
    Task<TestResultEntryDto> SaveParticleCountTestAsync(ParticleCountTestDto dto);
    Task<TestResultEntryDto> SaveGreasePenetrationTestAsync(GreasePenetrationTestDto dto);
    Task<TestResultEntryDto> SaveDroppingPointTestAsync(DroppingPointTestDto dto);
    Task<TestResultEntryDto> SaveRbotTestAsync(RbotTestDto dto);
    Task<TestResultEntryDto> SaveOxidationStabilityTestAsync(OxidationStabilityTestDto dto);
    Task<TestResultEntryDto> SaveDeleteriousTestAsync(DeleteriousTestDto dto);
    Task<TestResultEntryDto> SaveRheometerTestAsync(RheometerTestDto dto);
    Task<TestResultEntryDto> SaveFileDataTestAsync(FileDataTestDto dto);
    
    // Additional test-specific save methods
    Task<TestResultEntryDto> SaveSimpleResultTestAsync(SimpleResultTestDto dto);
    Task<TestResultEntryDto> SaveFilterInspectionTestAsync(FilterInspectionTestDto dto);
    Task<TestResultEntryDto> SaveFilterResidueTestAsync(FilterResidueTestDto dto);
    Task<TestResultEntryDto> SaveSimpleSelectTestAsync(SimpleSelectTestDto dto);
    Task<TestResultEntryDto> SaveRbotFailTimeTestAsync(RbotFailTimeTestDto dto);
    Task<TestResultEntryDto> SaveInspectFilterTestAsync(InspectFilterTestDto dto);
    Task<TestResultEntryDto> SaveDInchTestAsync(DInchTestDto dto);
    Task<TestResultEntryDto> SaveOilContentTestAsync(OilContentTestDto dto);
    Task<TestResultEntryDto> SaveVarnishPotentialTestAsync(VarnishPotentialTestDto dto);
    
    // Status management
    Task<object> GetTestStatusAsync(int sampleId, short testId);
    Task<bool> UpdateTestStatusAsync(TestStatusUpdateDto dto);
    Task<object> GetTestWorkflowAsync(short testId);
    Task<object> GetSaveStatusAsync(int sampleId, short testId);
    Task<object> GetComprehensiveTestInfoAsync(short testId);
    Task<List<TestResultEntryDto>> GetTestsPendingReviewForUserAsync(string userId);
}
