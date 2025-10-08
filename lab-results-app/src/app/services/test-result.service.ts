import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import {
    TestResultEntry,
    TestResultSave,
    TestResultResponse,
    SampleInfo,
    TestInfo,
    UserQualification,
    Equipment,
    ParticleType,
    TanTestDto,
    EmissionSpectroDto,
    ViscosityTestDto,
    FtirTestDto,
    FlashPointTestDto,
    ParticleCountTestDto,
    GreasePenetrationTestDto,
    DroppingPointTestDto,
    RbotTestDto,
    OxidationStabilityTestDto,
    DeleteriousTestDto,
    RheometerTestDto,
    SimpleResultTestDto,
    FilterInspectionTestDto,
    FilterResidueTestDto,
    SimpleSelectTestDto,
    RbotFailTimeTestDto,
    InspectFilterTestDto,
    DInchTestDto,
    OilContentTestDto,
    VarnishPotentialTestDto
} from '../models/test-result.models';
import { ValidationService, ValidationResult } from './validation.service';
import { UserQualificationService } from './user-qualification.service';
import { EquipmentService } from './equipment.service';
import { StatusManagementService } from './status-management.service';

@Injectable({
    providedIn: 'root'
})
export class TestResultService {
    private readonly http = inject(HttpClient);
    private readonly validationService = inject(ValidationService);
    private readonly userQualificationService = inject(UserQualificationService);
    private readonly equipmentService = inject(EquipmentService);
    private readonly statusManagementService = inject(StatusManagementService);

    private readonly apiUrl = 'https://localhost:7001/api';

    private readonly currentEmployeeId = new BehaviorSubject<string>('TEST001');
    public readonly currentEmployeeId$ = this.currentEmployeeId.asObservable();

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'X-Employee-Id': this.currentEmployeeId.value,
            'Content-Type': 'application/json'
        });
    }

    setCurrentEmployee(employeeId: string): void {
        this.currentEmployeeId.next(employeeId);
    }

    getSampleInfo(sampleId: number): Observable<SampleInfo> {
        return this.http.get<SampleInfo>(`${this.apiUrl}/testresults/sample/${sampleId}`);
    }

    getTestInfo(testId: number): Observable<TestInfo> {
        return this.http.get<TestInfo>(`${this.apiUrl}/testresults/test/${testId}`);
    }

    getUserQualification(employeeId: string, testId: number): Observable<UserQualification> {
        return this.http.get<UserQualification>(`${this.apiUrl}/testresults/qualification/${employeeId}/${testId}`);
    }

    getTestResults(sampleId: number, testId: number): Observable<TestResultEntry[]> {
        return this.http.get<TestResultEntry[]>(`${this.apiUrl}/testresults/${sampleId}/${testId}`);
    }

    saveTestResults(saveData: TestResultSave): Observable<TestResultResponse> {
        return this.http.post<TestResultResponse>(
            `${this.apiUrl}/testresults/save`,
            saveData,
            { headers: this.getHeaders() }
        );
    }

    getEquipment(equipmentType: string, testId?: number): Observable<Equipment[]> {
        const params = testId ? `?testId=${testId}` : '';
        return this.http.get<Equipment[]>(`${this.apiUrl}/testresults/equipment/${equipmentType}${params}`);
    }

    getViscometers(lubeType: string, testId: number): Observable<Equipment[]> {
        return this.http.get<Equipment[]>(`${this.apiUrl}/testresults/equipment/viscometers?lubeType=${lubeType}&testId=${testId}`);
    }

    getComments(area: string): Observable<Equipment[]> {
        return this.http.get<Equipment[]>(`${this.apiUrl}/testresults/equipment/comments/${area}`);
    }

    getParticleTypes(sampleId: number, testId: number): Observable<ParticleType[]> {
        return this.http.get<ParticleType[]>(`${this.apiUrl}/particleanalysis/${sampleId}/${testId}`);
    }

    saveParticleTypes(sampleId: number, testId: number, particleTypes: ParticleType[]): Observable<boolean> {
        return this.http.post<boolean>(`${this.apiUrl}/particleanalysis/${sampleId}/${testId}`, particleTypes);
    }

    // Helper methods for business logic
    canUserEnterResults(qualification: UserQualification): boolean {
        return qualification.canEnter;
    }

    canUserReviewResults(qualification: UserQualification): boolean {
        return qualification.canReview;
    }

    getTestDisplayName(test: TestInfo): string {
        return test.name || test.abbrev || test.shortAbbrev || `Test ${test.id}`;
    }

    formatEquipmentDisplay(equipment: Equipment): string {
        return equipment.displayText || equipment.name;
    }

    isTestResultValid(entry: TestResultEntry, testId: number): boolean {
        // Implement validation logic based on test type
        switch (testId) {
            case 10: // TAN
                return !!(entry.value1 && entry.value3);
            case 50:
            case 60: // Viscosity
                return !!(entry.id1 && entry.id2 && entry.id3 && entry.value1);
            case 70: // FTIR
                return true; // FTIR has optional fields
            case 120:
            case 180:
            case 210:
            case 240: // Particle Analysis
                return !!(entry.id1); // Overall severity required
            default:
                return !!(entry.value1);
        }
    }

    calculateTANResult(sampleWeight: number, finalBuret: number): number {
        if (sampleWeight === 0) return 0;
        const result = ((finalBuret * 5.61) / sampleWeight);
        return Math.round(result * 100) / 100;
    }

    calculateViscosityResult(stopTime: number, calibration: number): number {
        return Math.round(calibration * stopTime * 100) / 100;
    }

    calculateFlashPointResult(pressure: number, flashPointTemp: number): number {
        const result = flashPointTemp + (0.06 * (760 - pressure));
        return Math.round(result / 2) * 2;
    }

    calculateGreasePenetrationResult(cone1: number, cone2: number, cone3: number): number {
        const average = Math.round((cone1 + cone2 + cone3) / 3);
        return (average * 3.75) + 24;
    }

    calculateDroppingPointResult(droppingPoint: number, blockTemp: number): number {
        return Math.round(droppingPoint + ((blockTemp - droppingPoint) / 3));
    }

    calculateFilterResidueResult(sampleSize: number, residueWeight: number): number {
        if (sampleSize === 0) return 0;
        const result = (100 / sampleSize) * residueWeight;
        return Math.round(result * 10) / 10;
    }

    // Test-specific save methods
    saveTanTest(dto: TanTestDto): Observable<TanTestDto> {
        return this.http.post<TanTestDto>(`${this.apiUrl}/tests/tan`, dto, { headers: this.getHeaders() });
    }

    saveEmissionSpectroTest(dto: EmissionSpectroDto): Observable<EmissionSpectroDto> {
        return this.http.post<EmissionSpectroDto>(`${this.apiUrl}/tests/emission-spectro`, dto, { headers: this.getHeaders() });
    }

    saveViscosityTest(dto: ViscosityTestDto): Observable<ViscosityTestDto> {
        return this.http.post<ViscosityTestDto>(`${this.apiUrl}/tests/viscosity`, dto, { headers: this.getHeaders() });
    }

    saveFtirTest(dto: FtirTestDto): Observable<FtirTestDto> {
        return this.http.post<FtirTestDto>(`${this.apiUrl}/tests/ftir`, dto, { headers: this.getHeaders() });
    }

    saveFlashPointTest(dto: FlashPointTestDto): Observable<FlashPointTestDto> {
        return this.http.post<FlashPointTestDto>(`${this.apiUrl}/tests/flash-point`, dto, { headers: this.getHeaders() });
    }

    saveParticleCountTest(dto: ParticleCountTestDto): Observable<ParticleCountTestDto> {
        return this.http.post<ParticleCountTestDto>(`${this.apiUrl}/tests/particle-count`, dto, { headers: this.getHeaders() });
    }

    saveGreasePenetrationTest(dto: GreasePenetrationTestDto): Observable<GreasePenetrationTestDto> {
        return this.http.post<GreasePenetrationTestDto>(`${this.apiUrl}/tests/grease-penetration`, dto, { headers: this.getHeaders() });
    }

    saveDroppingPointTest(dto: DroppingPointTestDto): Observable<DroppingPointTestDto> {
        return this.http.post<DroppingPointTestDto>(`${this.apiUrl}/tests/dropping-point`, dto, { headers: this.getHeaders() });
    }

    saveRbotTest(dto: RbotTestDto): Observable<RbotTestDto> {
        return this.http.post<RbotTestDto>(`${this.apiUrl}/tests/rbot`, dto, { headers: this.getHeaders() });
    }

    saveOxidationStabilityTest(dto: OxidationStabilityTestDto): Observable<OxidationStabilityTestDto> {
        return this.http.post<OxidationStabilityTestDto>(`${this.apiUrl}/tests/oxidation-stability`, dto, { headers: this.getHeaders() });
    }

    saveDeleteriousTest(dto: DeleteriousTestDto): Observable<DeleteriousTestDto> {
        return this.http.post<DeleteriousTestDto>(`${this.apiUrl}/tests/deleterious`, dto, { headers: this.getHeaders() });
    }

    saveRheometerTest(dto: RheometerTestDto): Observable<RheometerTestDto> {
        return this.http.post<RheometerTestDto>(`${this.apiUrl}/tests/rheometer`, dto, { headers: this.getHeaders() });
    }

    // Additional test-specific save methods
    saveSimpleResultTest(dto: SimpleResultTestDto): Observable<SimpleResultTestDto> {
        return this.http.post<SimpleResultTestDto>(`${this.apiUrl}/tests/simple-result`, dto, { headers: this.getHeaders() });
    }

    saveFilterInspectionTest(dto: FilterInspectionTestDto): Observable<FilterInspectionTestDto> {
        return this.http.post<FilterInspectionTestDto>(`${this.apiUrl}/tests/filter-inspection`, dto, { headers: this.getHeaders() });
    }

    saveFilterResidueTest(dto: FilterResidueTestDto): Observable<FilterResidueTestDto> {
        return this.http.post<FilterResidueTestDto>(`${this.apiUrl}/tests/filter-residue`, dto, { headers: this.getHeaders() });
    }

    saveSimpleSelectTest(dto: SimpleSelectTestDto): Observable<SimpleSelectTestDto> {
        return this.http.post<SimpleSelectTestDto>(`${this.apiUrl}/tests/simple-select`, dto, { headers: this.getHeaders() });
    }

    saveRbotFailTimeTest(dto: RbotFailTimeTestDto): Observable<RbotFailTimeTestDto> {
        return this.http.post<RbotFailTimeTestDto>(`${this.apiUrl}/tests/rbot-fail-time`, dto, { headers: this.getHeaders() });
    }

    saveInspectFilterTest(dto: InspectFilterTestDto): Observable<InspectFilterTestDto> {
        return this.http.post<InspectFilterTestDto>(`${this.apiUrl}/tests/inspect-filter`, dto, { headers: this.getHeaders() });
    }

    saveDInchTest(dto: DInchTestDto): Observable<DInchTestDto> {
        return this.http.post<DInchTestDto>(`${this.apiUrl}/tests/d-inch`, dto, { headers: this.getHeaders() });
    }

    saveOilContentTest(dto: OilContentTestDto): Observable<OilContentTestDto> {
        return this.http.post<OilContentTestDto>(`${this.apiUrl}/tests/oil-content`, dto, { headers: this.getHeaders() });
    }

    saveVarnishPotentialTest(dto: VarnishPotentialTestDto): Observable<VarnishPotentialTestDto> {
        return this.http.post<VarnishPotentialTestDto>(`${this.apiUrl}/tests/varnish-potential`, dto, { headers: this.getHeaders() });
    }

    // Integration methods with validation, qualification, equipment, and status services

    /**
     * Validate test result with comprehensive validation
     */
    validateTestResult(testId: number, testData: any, isPartialSave: boolean = false): Observable<ValidationResult> {
        return new Observable(observer => {
            const result = this.validationService.validateTestResult(testId, testData, isPartialSave);
            observer.next(result);
            observer.complete();
        });
    }

    /**
     * Check if current user is qualified for a test
     */
    isUserQualifiedForTest(testId: number): Observable<boolean> {
        return this.userQualificationService.isUserQualified(this.currentEmployeeId.value, testId).pipe(
            map(qualification => qualification !== null)
        );
    }

    /**
     * Get user qualification level for a test
     */
    getUserQualificationForTest(testId: number): Observable<string | null> {
        return this.userQualificationService.isUserQualified(this.currentEmployeeId.value, testId);
    }

    /**
     * Check if user can perform an action
     */
    canUserPerformAction(testId: number, action: string, currentStatus: string = 'X'): Observable<boolean> {
        return combineLatest([
            this.getUserQualificationForTest(testId),
            this.statusManagementService.canPerformAction(action, currentStatus, testId, '')
        ]).pipe(
            map(([qualification, canPerform]) => {
                if (!qualification) return false;
                return this.statusManagementService.canPerformAction(action, currentStatus, testId, qualification).pipe(
                    map(result => result)
                );
            }),
            switchMap(result => result)
        );
    }

    /**
     * Get equipment for a test with validation
     */
    getEquipmentForTestWithValidation(testId: number, equipmentType: string): Observable<Equipment[]> {
        return this.equipmentService.getEquipmentByTypeAndTest(equipmentType, testId).pipe(
            map(equipment => equipment.filter(e => !e.isOverdue))
        );
    }

    /**
     * Validate equipment selection
     */
    validateEquipmentSelection(equipName: string, testId: number, equipType: string): Observable<{ isValid: boolean; message: string }> {
        return this.equipmentService.validateEquipmentForTest(equipName, testId, equipType);
    }

    /**
     * Get appropriate status for save operation
     */
    getSaveStatus(testId: number, isPartialSave: boolean): Observable<string> {
        return this.getUserQualificationForTest(testId).pipe(
            switchMap(qualification => {
                if (isPartialSave) {
                    return this.statusManagementService.getPartialSaveStatus(testId, qualification || '');
                } else {
                    return this.statusManagementService.getFullSaveStatus(testId, qualification || '');
                }
            })
        );
    }

    /**
     * Save test result with comprehensive validation and status management
     */
    saveTestResultWithValidation(
        testId: number,
        testData: any,
        isPartialSave: boolean = false
    ): Observable<{ success: boolean; message: string; validationResult?: ValidationResult }> {
        return combineLatest([
            this.validateTestResult(testId, testData, isPartialSave),
            this.isUserQualifiedForTest(testId),
            this.getSaveStatus(testId, isPartialSave)
        ]).pipe(
            switchMap(([validationResult, isQualified, status]) => {
                if (!validationResult.isValid) {
                    return new Observable(observer => {
                        observer.next({
                            success: false,
                            message: 'Validation failed: ' + validationResult.errors.join(', '),
                            validationResult
                        });
                        observer.complete();
                    });
                }

                if (!isQualified) {
                    return new Observable(observer => {
                        observer.next({
                            success: false,
                            message: 'User is not qualified for this test'
                        });
                        observer.complete();
                    });
                }

                // Add status to test data
                const testDataWithStatus = { ...testData, status };

                // Save the test result
                return this.saveTestResults({
                    sampleId: testData.sampleId,
                    testId: testId,
                    mode: 'entry',
                    entries: [{
                        sampleId: testData.sampleId,
                        testId: testId,
                        trialNumber: testData.trialNumber || 1,
                        value1: testData.value1,
                        value2: testData.value2,
                        value3: testData.value3,
                        id1: testData.id1,
                        id2: testData.id2,
                        id3: testData.id3,
                        status: status,
                        mainComments: testData.mainComments,
                        isPartialSave: isPartialSave,
                        isMediaReady: false,
                        isDelete: false
                    }],
                    isPartialSave: isPartialSave,
                    isMediaReady: false,
                    isDelete: false
                }).pipe(
                    map(response => ({
                        success: true,
                        message: 'Test result saved successfully',
                        validationResult
                    }))
                );
            })
        );
    }

    /**
     * Get test workflow information
     */
    getTestWorkflowInfo(testId: number): Observable<{
        workflow: any;
        currentStatus: string;
        nextStatuses: any[];
        canPartialSave: boolean;
        canDelete: boolean;
        requiresReview: boolean;
    }> {
        return combineLatest([
            this.statusManagementService.getTestWorkflow(testId),
            this.statusManagementService.isPartialSaveAllowed(testId),
            this.statusManagementService.isDeleteAllowed(testId),
            this.statusManagementService.isReviewRequired(testId)
        ]).pipe(
            map(([workflow, canPartialSave, canDelete, requiresReview]) => ({
                workflow,
                currentStatus: 'X', // This would come from the actual test data
                nextStatuses: [], // This would be populated based on current status
                canPartialSave,
                canDelete,
                requiresReview
            }))
        );
    }

    /**
     * Get comprehensive test information including validation rules, equipment, and workflow
     */
    getComprehensiveTestInfo(testId: number): Observable<{
        testInfo: TestInfo;
        validationRules: any;
        equipmentTypes: any[];
        workflow: any;
        userQualification: string | null;
    }> {
        return combineLatest([
            this.getTestInfo(testId),
            this.equipmentService.getEquipmentTypesForTest(testId),
            this.statusManagementService.getTestWorkflow(testId),
            this.getUserQualificationForTest(testId)
        ]).pipe(
            map(([testInfo, equipmentTypes, workflow, userQualification]) => ({
                testInfo,
                validationRules: this.validationService['validationRules'][testId] || {},
                equipmentTypes,
                workflow,
                userQualification
            }))
        );
    }

    /**
     * Get overdue equipment for current user's tests
     */
    getOverdueEquipmentForUser(): Observable<Equipment[]> {
        return this.equipmentService.getOverdueEquipment();
    }

    /**
     * Get tests pending review for current user
     */
    getTestsPendingReviewForUser(): Observable<any[]> {
        return this.statusManagementService.getTestsPendingReview();
    }

    /**
     * Get user's qualification summary
     */
    getUserQualificationSummary(): Observable<{
        highestLevel: string | null;
        isSupervisor: boolean;
        qualifications: any[];
    }> {
        return combineLatest([
            this.userQualificationService.getHighestQualificationLevel(this.currentEmployeeId.value),
            this.userQualificationService.isSupervisor(this.currentEmployeeId.value),
            this.userQualificationService.getUserQualifications(this.currentEmployeeId.value)
        ]).pipe(
            map(([highestLevel, isSupervisor, qualifications]) => ({
                highestLevel,
                isSupervisor,
                qualifications
            }))
        );
    }
}
