import { TestBed } from '@angular/core/testing';
import { ValidationService, ValidationResult } from './validation.service';
import { TestResultService } from './test-result.service';

describe('ValidationService', () => {
    let service: ValidationService;
    let mockTestResultService: jasmine.SpyObj<TestResultService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('TestResultService', ['getSampleInfoAsync']);

        TestBed.configureTestingModule({
            providers: [
                ValidationService,
                { provide: TestResultService, useValue: spy }
            ]
        });
        service = TestBed.inject(ValidationService);
        mockTestResultService = TestBed.inject(TestResultService) as jasmine.SpyObj<TestResultService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('validateTestResult', () => {
        it('should validate TAN test with valid data', () => {
            const testData = {
                sampleWeight: 1.5,
                finalBuret: 2.5,
                tanResult: 0.94,
                equipmentId: 'EQ001',
                isSelected: true
            };

            const result = service.validateTestResult(10, testData, false, 'Q');

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should validate TAN test with missing required fields', () => {
            const testData = {
                sampleWeight: null,
                finalBuret: null,
                isSelected: true
            };

            const result = service.validateTestResult(10, testData, false, 'Q');

            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors.some(error => error.includes('Sample Weight'))).toBe(true);
            expect(result.errors.some(error => error.includes('Final Buret'))).toBe(true);
        });

        it('should validate viscosity test with Q/QAG quality class requiring two trials', () => {
            const testData = {
                stopWatchTime: 300,
                viscometerId: 'VISC001',
                trial2: { stopWatchTime: 310 },
                isSelected: true
            };

            const result = service.validateTestResult(50, testData, false, 'Q');

            expect(result.isValid).toBe(true);
        });

        it('should validate viscosity test with Q/QAG quality class missing second trial', () => {
            const testData = {
                stopWatchTime: 300,
                viscometerId: 'VISC001',
                isSelected: true
            };

            const result = service.validateTestResult(50, testData, false, 'Q');

            expect(result.isValid).toBe(false);
            expect(result.errors.some(error => error.includes('Two trials are required'))).toBe(true);
        });

        it('should validate dropping point test with same thermometers', () => {
            const testData = {
                droppingPointTemperature: 200,
                blockTemperature: 200,
                isSelected: true
            };

            const result = service.validateTestResult(140, testData, false, 'Q');

            expect(result.isValid).toBe(false);
            expect(result.errors.some(error => error.includes('thermometers cannot be the same'))).toBe(true);
        });

        it('should validate particle analysis tests requiring overall severity', () => {
            const testData = {
                overallSeverity: null,
                particleTypes: [],
                isSelected: true
            };

            const result = service.validateTestResult(120, testData, false, 'Q');

            expect(result.isValid).toBe(false);
            expect(result.errors.some(error => error.includes('Overall Severity'))).toBe(true);
        });

        it('should validate particle analysis tests requiring characterized particle types', () => {
            const testData = {
                overallSeverity: '2',
                particleTypes: [
                    { status: '0', type: 'METALLIC' },
                    { status: '0', type: 'NON-METALLIC' }
                ],
                isSelected: true
            };

            const result = service.validateTestResult(120, testData, false, 'Q');

            expect(result.isValid).toBe(false);
            expect(result.errors.some(error => error.includes('particle type should be characterized'))).toBe(true);
        });

        it('should validate filter residue test requiring sample size and residue weight', () => {
            const testData = {
                sampleSize: null,
                residueWeight: null,
                isSelected: true
            };

            const result = service.validateTestResult(180, testData, false, 'Q');

            expect(result.isValid).toBe(false);
            expect(result.errors.some(error => error.includes('Sample Size and Residue Weight'))).toBe(true);
        });

        it('should validate inspect filter test requiring volume of oil used', () => {
            const testData = {
                volumeOfOilUsed: null,
                isSelected: true
            };

            const result = service.validateTestResult(240, testData, false, 'Q');

            expect(result.isValid).toBe(false);
            expect(result.errors.some(error => error.includes('Volume of Oil Used'))).toBe(true);
        });

        it('should validate test selection requirement', () => {
            const testData = {
                sampleWeight: 1.5,
                finalBuret: 2.5,
                isSelected: false
            };

            const result = service.validateTestResult(10, testData, false, 'Q');

            expect(result.isValid).toBe(false);
            expect(result.errors.some(error => error.includes('checked a test to save'))).toBe(true);
        });
    });

    describe('validateParticleTypes', () => {
        it('should validate particle types with complete data', () => {
            const particleTypes = [
                {
                    status: '1',
                    type: 'METALLIC',
                    heat: 'HIGH',
                    concentration: 'MODERATE',
                    sizeAve: 'LARGE',
                    sizeMax: 'LARGE',
                    color: 'SILVER',
                    texture: 'SMOOTH',
                    composition: 'IRON',
                    severity: '2'
                }
            ];

            const result = service.validateParticleTypes(particleTypes, 120);

            expect(result.isValid).toBe(true);
        });

        it('should validate particle types with missing fields', () => {
            const particleTypes = [
                {
                    status: '1',
                    type: 'METALLIC',
                    heat: null,
                    concentration: null,
                    sizeAve: null,
                    sizeMax: null,
                    color: null,
                    texture: null,
                    composition: null,
                    severity: null
                }
            ];

            const result = service.validateParticleTypes(particleTypes, 120);

            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should validate particle types with no characterized types', () => {
            const particleTypes = [
                {
                    status: '0',
                    type: 'METALLIC'
                }
            ];

            const result = service.validateParticleTypes(particleTypes, 120);

            expect(result.isValid).toBe(false);
            expect(result.errors.some(error => error.includes('particle type should be characterized'))).toBe(true);
        });
    });

    describe('validateRepeatability', () => {
        it('should validate repeatability for Q/QAG samples with acceptable variation', () => {
            const trials = [
                { calculatedResult: 100.0 },
                { calculatedResult: 100.2 }
            ];

            const result = service.validateRepeatability(trials, 50, 'Q');

            expect(result.isValid).toBe(true);
        });

        it('should validate repeatability for Q/QAG samples with unacceptable variation', () => {
            const trials = [
                { calculatedResult: 100.0 },
                { calculatedResult: 101.0 }
            ];

            const result = service.validateRepeatability(trials, 50, 'Q');

            expect(result.isValid).toBe(false);
            expect(result.errors.some(error => error.includes('exceeds the 0.35% limit'))).toBe(true);
        });

        it('should require two trials for Q/QAG samples', () => {
            const trials = [
                { calculatedResult: 100.0 }
            ];

            const result = service.validateRepeatability(trials, 50, 'Q');

            expect(result.isValid).toBe(false);
            expect(result.errors.some(error => error.includes('Two trials are required'))).toBe(true);
        });
    });

    describe('validateEquipment', () => {
        it('should validate equipment selection', () => {
            const result = service.validateEquipment('EQ001', 'THERMOMETER', 10);

            expect(result.isValid).toBe(true);
        });

        it('should validate missing equipment selection', () => {
            const result = service.validateEquipment('', 'THERMOMETER', 10);

            expect(result.isValid).toBe(false);
            expect(result.errors.some(error => error.includes('selection is required'))).toBe(true);
        });
    });

    describe('validateUserQualification', () => {
        it('should validate user qualification', () => {
            const result = service.validateUserQualification('TEST001', 10);

            expect(result.isValid).toBe(true);
        });

        it('should validate missing user ID', () => {
            const result = service.validateUserQualification('', 10);

            expect(result.isValid).toBe(false);
            expect(result.errors.some(error => error.includes('User ID is required'))).toBe(true);
        });
    });
});