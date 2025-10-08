import { TestBed } from '@angular/core/testing';
import { EquipmentService } from './equipment.service';

describe('EquipmentService', () => {
    let service: EquipmentService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EquipmentService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getEquipmentForTest', () => {
        it('should return equipment for test', () => {
            const testId = 10;
            const result = service.getEquipmentForTest(testId);
            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('validateEquipmentSelection', () => {
        it('should validate equipment selection successfully', () => {
            const equipmentId = 1;
            const testId = 10;
            const result = service.validateEquipmentSelection(equipmentId, testId);
            expect(result.isValid).toBe(true);
        });
    });

    describe('getOverdueEquipment', () => {
        it('should return overdue equipment', () => {
            const result = service.getOverdueEquipment();
            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
        });
    });
});
