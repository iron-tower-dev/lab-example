import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestResultService } from './test-result.service';
import { ValidationService } from './validation.service';
import { UserQualificationService } from './user-qualification.service';
import { EquipmentService } from './equipment.service';
import { StatusManagementService } from './status-management.service';

describe('TestResultService', () => {
    let service: TestResultService;
    let httpMock: HttpTestingController;
    let mockValidationService: jasmine.SpyObj<ValidationService>;
    let mockUserQualificationService: jasmine.SpyObj<UserQualificationService>;
    let mockEquipmentService: jasmine.SpyObj<EquipmentService>;
    let mockStatusManagementService: jasmine.SpyObj<StatusManagementService>;

    beforeEach(() => {
        const validationSpy = jasmine.createSpyObj('ValidationService', ['validateTestResult']);
        const userQualificationSpy = jasmine.createSpyObj('UserQualificationService', ['getUserQualification']);
        const equipmentSpy = jasmine.createSpyObj('EquipmentService', ['getEquipmentByType']);
        const statusManagementSpy = jasmine.createSpyObj('StatusManagementService', ['getTestStatus']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                TestResultService,
                { provide: ValidationService, useValue: validationSpy },
                { provide: UserQualificationService, useValue: userQualificationSpy },
                { provide: EquipmentService, useValue: equipmentSpy },
                { provide: StatusManagementService, useValue: statusManagementSpy }
            ]
        });

        service = TestBed.inject(TestResultService);
        httpMock = TestBed.inject(HttpTestingController);
        mockValidationService = TestBed.inject(ValidationService) as jasmine.SpyObj<ValidationService>;
        mockUserQualificationService = TestBed.inject(UserQualificationService) as jasmine.SpyObj<UserQualificationService>;
        mockEquipmentService = TestBed.inject(EquipmentService) as jasmine.SpyObj<EquipmentService>;
        mockStatusManagementService = TestBed.inject(StatusManagementService) as jasmine.SpyObj<StatusManagementService>;
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getSampleInfo', () => {
        it('should return sample info', () => {
            const mockSampleInfo = {
                sampleId: 1,
                tagNumber: 'TEST001',
                component: 'COMP001',
                location: 'LOC001',
                lubeType: 'HYDRAULIC',
                qualityClass: 'Q'
            };

            service.getSampleInfo(1).subscribe(result => {
                expect(result).toEqual(mockSampleInfo);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/samples/1');
            expect(req.request.method).toBe('GET');
            req.flush(mockSampleInfo);
        });
    });

    describe('getTestInfo', () => {
        it('should return test info', () => {
            const mockTestInfo = {
                id: 10,
                name: 'TAN Test',
                description: 'Total Acid Number Test',
                isActive: true,
                testStandId: 1
            };

            service.getTestInfo(10).subscribe(result => {
                expect(result).toEqual(mockTestInfo);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/10');
            expect(req.request.method).toBe('GET');
            req.flush(mockTestInfo);
        });
    });

    describe('getUserQualification', () => {
        it('should return user qualification', () => {
            const mockQualification = {
                employeeId: 'TEST001',
                testId: 10,
                testName: 'TAN Test',
                qualificationLevel: 'Q',
                canEnter: true,
                canReview: true,
                canReviewOwn: false
            };

            service.getUserQualification('TEST001', 10).subscribe(result => {
                expect(result).toEqual(mockQualification);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/user-qualifications/TEST001/10');
            expect(req.request.method).toBe('GET');
            req.flush(mockQualification);
        });
    });

    describe('getTestResults', () => {
        it('should return test results', () => {
            const mockTestResults = [
                {
                    sampleId: 1,
                    testId: 10,
                    trialNumber: 1,
                    value1: '1.5',
                    value2: '2.5',
                    value3: '0.94',
                    status: 'S',
                    entryDate: new Date(),
                    entryId: 'TEST001'
                }
            ];

            service.getTestResults(1, 10).subscribe(result => {
                expect(result).toEqual(mockTestResults);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/test-results/1/10');
            expect(req.request.method).toBe('GET');
            req.flush(mockTestResults);
        });
    });

    describe('saveTestResults', () => {
        it('should save test results', () => {
            const mockSaveDto = {
                sampleId: 1,
                testId: 10,
                trialNumber: 1,
                value1: '1.5',
                value2: '2.5',
                value3: '0.94',
                status: 'S',
                mainComments: 'Test comment'
            };

            const mockResponse = {
                success: true,
                message: 'Test results saved successfully',
                sampleId: 1,
                testId: 10,
                status: 'S',
                errors: []
            };

            service.saveTestResults(mockSaveDto).subscribe(result => {
                expect(result).toEqual(mockResponse);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/test-results/');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockSaveDto);
            expect(req.request.headers.get('X-Employee-Id')).toBe('TEST001');
            req.flush(mockResponse);
        });
    });

    describe('saveTanTest', () => {
        it('should save TAN test', () => {
            const mockTanTestDto = {
                sampleId: 1,
                testId: 10,
                trialNumber: 1,
                sampleWeight: 1.5,
                finalBuret: 2.5,
                tanCalculated: 0.94,
                equipmentId: 'EQ001',
                status: 'S',
                comments: 'Test comment'
            };

            service.saveTanTest(mockTanTestDto).subscribe(result => {
                expect(result).toEqual(mockTanTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/tan');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockTanTestDto);
            req.flush(mockTanTestDto);
        });
    });

    describe('saveViscosityTest', () => {
        it('should save viscosity test', () => {
            const mockViscosityTestDto = {
                sampleId: 1,
                testId: 50,
                trialNumber: 1,
                stopWatchTime: 300,
                viscometerId: 'VISC001',
                calculatedResult: 100.0,
                status: 'S',
                comments: 'Test comment'
            };

            service.saveViscosityTest(mockViscosityTestDto).subscribe(result => {
                expect(result).toEqual(mockViscosityTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/viscosity');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockViscosityTestDto);
            req.flush(mockViscosityTestDto);
        });
    });

    describe('saveFlashPointTest', () => {
        it('should save flash point test', () => {
            const mockFlashPointTestDto = {
                sampleId: 1,
                testId: 80,
                trialNumber: 1,
                barometricPressure: 760,
                flashPointTemperature: 200,
                correctedFlashPoint: 200,
                status: 'S',
                comments: 'Test comment'
            };

            service.saveFlashPointTest(mockFlashPointTestDto).subscribe(result => {
                expect(result).toEqual(mockFlashPointTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/flash-point');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockFlashPointTestDto);
            req.flush(mockFlashPointTestDto);
        });
    });

    describe('saveParticleCountTest', () => {
        it('should save particle count test', () => {
            const mockParticleCountTestDto = {
                sampleId: 1,
                testId: 160,
                trialNumber: 1,
                micron5_10: 100,
                micron10_15: 50,
                micron15_25: 25,
                micron25_50: 10,
                micron50_100: 5,
                micron100: 2,
                isoCode: '18/15',
                nasClass: '7',
                status: 'S',
                comments: 'Test comment'
            };

            service.saveParticleCountTest(mockParticleCountTestDto).subscribe(result => {
                expect(result).toEqual(mockParticleCountTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/particle-count');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockParticleCountTestDto);
            req.flush(mockParticleCountTestDto);
        });
    });

    describe('saveGreasePenetrationTest', () => {
        it('should save grease penetration test', () => {
            const mockGreasePenetrationTestDto = {
                sampleId: 1,
                testId: 130,
                trialNumber: 1,
                firstPenetration: 280,
                secondPenetration: 285,
                thirdPenetration: 275,
                calculatedResult: 1070,
                nlgiGrade: '2',
                status: 'S',
                comments: 'Test comment'
            };

            service.saveGreasePenetrationTest(mockGreasePenetrationTestDto).subscribe(result => {
                expect(result).toEqual(mockGreasePenetrationTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/grease-penetration');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockGreasePenetrationTestDto);
            req.flush(mockGreasePenetrationTestDto);
        });
    });

    describe('saveDroppingPointTest', () => {
        it('should save dropping point test', () => {
            const mockDroppingPointTestDto = {
                sampleId: 1,
                testId: 140,
                trialNumber: 1,
                droppingPointTemperature: 200,
                blockTemperature: 210,
                correctedDroppingPoint: 203,
                status: 'S',
                comments: 'Test comment'
            };

            service.saveDroppingPointTest(mockDroppingPointTestDto).subscribe(result => {
                expect(result).toEqual(mockDroppingPointTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/dropping-point');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockDroppingPointTestDto);
            req.flush(mockDroppingPointTestDto);
        });
    });

    describe('saveRbotTest', () => {
        it('should save RBOT test', () => {
            const mockRbotTestDto = {
                sampleId: 1,
                testId: 170,
                trialNumber: 1,
                failTime: 1200,
                status: 'S',
                comments: 'Test comment'
            };

            service.saveRbotTest(mockRbotTestDto).subscribe(result => {
                expect(result).toEqual(mockRbotTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/rbot');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockRbotTestDto);
            req.flush(mockRbotTestDto);
        });
    });

    describe('saveOxidationStabilityTest', () => {
        it('should save oxidation stability test', () => {
            const mockOxidationStabilityTestDto = {
                sampleId: 1,
                testId: 220,
                trialNumber: 1,
                passFailResult: 'pass',
                status: 'S',
                comments: 'Test comment'
            };

            service.saveOxidationStabilityTest(mockOxidationStabilityTestDto).subscribe(result => {
                expect(result).toEqual(mockOxidationStabilityTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/oxidation-stability');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockOxidationStabilityTestDto);
            req.flush(mockOxidationStabilityTestDto);
        });
    });

    describe('saveDeleteriousTest', () => {
        it('should save deleterious test', () => {
            const mockDeleteriousTestDto = {
                sampleId: 1,
                testId: 250,
                trialNumber: 1,
                pressure: 1000,
                scratches: 5,
                passFail: 'pass',
                status: 'S',
                comments: 'Test comment'
            };

            service.saveDeleteriousTest(mockDeleteriousTestDto).subscribe(result => {
                expect(result).toEqual(mockDeleteriousTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/deleterious');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockDeleteriousTestDto);
            req.flush(mockDeleteriousTestDto);
        });
    });

    describe('saveRheometerTest', () => {
        it('should save rheometer test', () => {
            const mockRheometerTestDto = {
                sampleId: 1,
                testId: 280,
                trialNumber: 1,
                dInch: 0.5,
                oilContent: 85.0,
                varnishPotentialRating: 2.5,
                status: 'S',
                comments: 'Test comment'
            };

            service.saveRheometerTest(mockRheometerTestDto).subscribe(result => {
                expect(result).toEqual(mockRheometerTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/rheometer');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockRheometerTestDto);
            req.flush(mockRheometerTestDto);
        });
    });

    describe('saveSimpleResultTest', () => {
        it('should save simple result test', () => {
            const mockSimpleResultTestDto = {
                sampleId: 1,
                testId: 110,
                trialNumber: 1,
                value1: 100.0,
                status: 'S',
                comments: 'Test comment'
            };

            service.saveSimpleResultTest(mockSimpleResultTestDto).subscribe(result => {
                expect(result).toEqual(mockSimpleResultTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/simple-result');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockSimpleResultTestDto);
            req.flush(mockSimpleResultTestDto);
        });
    });

    describe('saveFilterInspectionTest', () => {
        it('should save filter inspection test', () => {
            const mockFilterInspectionTestDto = {
                sampleId: 1,
                testId: 120,
                trialNumber: 1,
                major: 'MODERATE',
                minor: 'LIGHT',
                trace: 'NONE',
                narrative: 'Test narrative',
                status: 'S',
                comments: 'Test comment'
            };

            service.saveFilterInspectionTest(mockFilterInspectionTestDto).subscribe(result => {
                expect(result).toEqual(mockFilterInspectionTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/filter-inspection');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockFilterInspectionTestDto);
            req.flush(mockFilterInspectionTestDto);
        });
    });

    describe('saveFilterResidueTest', () => {
        it('should save filter residue test', () => {
            const mockFilterResidueTestDto = {
                sampleId: 1,
                testId: 180,
                trialNumber: 1,
                sampleSize: 100.0,
                residueWeight: 2.5,
                finalWeight: 97.5,
                major: 'MODERATE',
                minor: 'LIGHT',
                trace: 'NONE',
                narrative: 'Test narrative',
                status: 'S',
                comments: 'Test comment'
            };

            service.saveFilterResidueTest(mockFilterResidueTestDto).subscribe(result => {
                expect(result).toEqual(mockFilterResidueTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/filter-residue');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockFilterResidueTestDto);
            req.flush(mockFilterResidueTestDto);
        });
    });

    describe('saveSimpleSelectTest', () => {
        it('should save simple select test', () => {
            const mockSimpleSelectTestDto = {
                sampleId: 1,
                testId: 220,
                trialNumber: 1,
                thermometerId: 'THERM001',
                result: 'Pass',
                status: 'S',
                comments: 'Test comment'
            };

            service.saveSimpleSelectTest(mockSimpleSelectTestDto).subscribe(result => {
                expect(result).toEqual(mockSimpleSelectTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/simple-select');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockSimpleSelectTestDto);
            req.flush(mockSimpleSelectTestDto);
        });
    });

    describe('saveRbotFailTimeTest', () => {
        it('should save RBOT fail time test', () => {
            const mockRbotFailTimeTestDto = {
                sampleId: 1,
                testId: 230,
                trialNumber: 1,
                thermometerId: 'THERM001',
                failTime: 1200,
                fileData: 'Test file data',
                status: 'S',
                comments: 'Test comment'
            };

            service.saveRbotFailTimeTest(mockRbotFailTimeTestDto).subscribe(result => {
                expect(result).toEqual(mockRbotFailTimeTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/rbot-fail-time');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockRbotFailTimeTestDto);
            req.flush(mockRbotFailTimeTestDto);
        });
    });

    describe('saveInspectFilterTest', () => {
        it('should save inspect filter test', () => {
            const mockInspectFilterTestDto = {
                sampleId: 1,
                testId: 240,
                trialNumber: 1,
                volumeOfOilUsed: '~500ml',
                major: 'MODERATE',
                minor: 'LIGHT',
                trace: 'NONE',
                narrative: 'Test narrative',
                status: 'S',
                comments: 'Test comment'
            };

            service.saveInspectFilterTest(mockInspectFilterTestDto).subscribe(result => {
                expect(result).toEqual(mockInspectFilterTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/inspect-filter');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockInspectFilterTestDto);
            req.flush(mockInspectFilterTestDto);
        });
    });

    describe('saveDInchTest', () => {
        it('should save D-inch test', () => {
            const mockDInchTestDto = {
                sampleId: 1,
                testId: 284,
                trialNumber: 1,
                dInch: 0.5,
                status: 'S',
                comments: 'Test comment'
            };

            service.saveDInchTest(mockDInchTestDto).subscribe(result => {
                expect(result).toEqual(mockDInchTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/d-inch');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockDInchTestDto);
            req.flush(mockDInchTestDto);
        });
    });

    describe('saveOilContentTest', () => {
        it('should save oil content test', () => {
            const mockOilContentTestDto = {
                sampleId: 1,
                testId: 285,
                trialNumber: 1,
                oilContent: 85.0,
                status: 'S',
                comments: 'Test comment'
            };

            service.saveOilContentTest(mockOilContentTestDto).subscribe(result => {
                expect(result).toEqual(mockOilContentTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/oil-content');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockOilContentTestDto);
            req.flush(mockOilContentTestDto);
        });
    });

    describe('saveVarnishPotentialTest', () => {
        it('should save varnish potential test', () => {
            const mockVarnishPotentialTestDto = {
                sampleId: 1,
                testId: 286,
                trialNumber: 1,
                varnishPotentialRating: 2.5,
                status: 'S',
                comments: 'Test comment'
            };

            service.saveVarnishPotentialTest(mockVarnishPotentialTestDto).subscribe(result => {
                expect(result).toEqual(mockVarnishPotentialTestDto);
            });

            const req = httpMock.expectOne('https://localhost:7001/api/tests/varnish-potential');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockVarnishPotentialTestDto);
            req.flush(mockVarnishPotentialTestDto);
        });
    });
});