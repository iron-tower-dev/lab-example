import { TestBed } from '@angular/core/testing';
import { StatusManagementService } from './status-management.service';

describe('StatusManagementService', () => {
    let service: StatusManagementService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StatusManagementService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getTestStatus', () => {
        it('should return test status', () => {
            const sampleId = 1001;
            const testId = 10;
            const result = service.getTestStatus(sampleId, testId);
            expect(result).toBeDefined();
            expect(result.sampleId).toBe(sampleId);
            expect(result.testId).toBe(testId);
        });
    });

    describe('updateTestStatus', () => {
        it('should update test status successfully', () => {
            const statusUpdate = {
                sampleId: 1001,
                testId: 10,
                newStatus: 'completed',
                comments: 'Test completed'
            };
            const result = service.updateTestStatus(statusUpdate);
            expect(result).toBe(true);
        });
    });

    describe('getTestWorkflow', () => {
        it('should return test workflow', () => {
            const testId = 10;
            const result = service.getTestWorkflow(testId);
            expect(result).toBeDefined();
            expect(result.testId).toBe(testId);
        });
    });
});
