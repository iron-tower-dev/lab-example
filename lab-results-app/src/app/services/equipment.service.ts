import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

export interface Equipment {
    id: number;
    equipType: string;
    equipName: string;
    exclude: boolean;
    testId: number;
    dueDate: Date | null;
    comments: string | null;
    val1: number | null;
    val2: number | null;
    val3: number | null;
    val4: number | null;
    isOverdue: boolean;
    suffix?: string;
}

export interface EquipmentType {
    type: string;
    description: string;
    testIds: number[];
}

export interface EquipmentCalibration {
    equipmentId: number;
    calibrationDate: Date;
    nextDueDate: Date;
    calibrationValue: number;
    status: 'Valid' | 'Expiring' | 'Expired';
}

@Injectable({
    providedIn: 'root'
})
export class EquipmentService {
    private http = inject(HttpClient);

    // Mock data for development - in production this would come from the API
    private readonly mockEquipment: Equipment[] = [
        {
            id: 1,
            equipType: 'THERMOMETER',
            equipName: 'THM001',
            exclude: false,
            testId: 50,
            dueDate: new Date('2024-12-31'),
            comments: 'Digital thermometer for viscosity testing',
            val1: 0.1,
            val2: null,
            val3: null,
            val4: null,
            isOverdue: false
        },
        {
            id: 2,
            equipType: 'THERMOMETER',
            equipName: 'THM002',
            exclude: false,
            testId: 60,
            dueDate: new Date('2024-11-15'),
            comments: 'Digital thermometer for high temp viscosity',
            val1: 0.1,
            val2: null,
            val3: null,
            val4: null,
            isOverdue: true
        },
        {
            id: 3,
            equipType: 'TIMER',
            equipName: 'TMR001',
            exclude: false,
            testId: 50,
            dueDate: new Date('2024-12-20'),
            comments: 'Stopwatch for viscosity timing',
            val1: null,
            val2: null,
            val3: null,
            val4: null,
            isOverdue: false
        },
        {
            id: 4,
            equipType: 'VISCOMETER',
            equipName: 'VSC001',
            exclude: false,
            testId: 50,
            dueDate: new Date('2024-12-25'),
            comments: 'Cannon-Fenske viscometer',
            val1: 0.478,
            val2: 1.0,
            val3: null,
            val4: null,
            isOverdue: false,
            suffix: '*'
        },
        {
            id: 5,
            equipType: 'VISCOMETER',
            equipName: 'VSC002',
            exclude: false,
            testId: 60,
            dueDate: new Date('2024-12-30'),
            comments: 'Cannon-Fenske viscometer for 100°C',
            val1: 0.478,
            val2: 1.0,
            val3: null,
            val4: null,
            isOverdue: false,
            suffix: '*'
        },
        {
            id: 6,
            equipType: 'BAROMETER',
            equipName: 'BAR001',
            exclude: false,
            testId: 80,
            dueDate: new Date('2024-12-15'),
            comments: 'Barometric pressure gauge',
            val1: null,
            val2: null,
            val3: null,
            val4: null,
            isOverdue: false
        },
        {
            id: 7,
            equipType: 'DELETERIOUS',
            equipName: 'DEL001',
            exclude: false,
            testId: 250,
            dueDate: new Date('2024-12-10'),
            comments: 'Deleterious test apparatus',
            val1: null,
            val2: null,
            val3: null,
            val4: null,
            isOverdue: false
        }
    ];

    private readonly equipmentTypes: EquipmentType[] = [
        {
            type: 'THERMOMETER',
            description: 'Temperature measurement equipment',
            testIds: [50, 60, 80, 140, 170, 220, 230]
        },
        {
            type: 'TIMER',
            description: 'Timing equipment',
            testIds: [50, 60]
        },
        {
            type: 'VISCOMETER',
            description: 'Viscosity measurement equipment',
            testIds: [50, 60]
        },
        {
            type: 'BAROMETER',
            description: 'Barometric pressure measurement',
            testIds: [80]
        },
        {
            type: 'DELETERIOUS',
            description: 'Deleterious test equipment',
            testIds: [250]
        }
    ];

    /**
     * Get all equipment
     */
    getAllEquipment(): Observable<Equipment[]> {
        return of(this.mockEquipment);
    }

    /**
     * Get equipment by type
     */
    getEquipmentByType(equipType: string): Observable<Equipment[]> {
        const equipment = this.mockEquipment.filter(e => e.equipType === equipType && !e.exclude);
        return of(equipment);
    }

    /**
     * Get equipment for a specific test
     */
    getEquipmentForTest(testId: number): Observable<Equipment[]> {
        const equipment = this.mockEquipment.filter(e => e.testId === testId && !e.exclude);
        return of(equipment);
    }

    /**
     * Get equipment by type and test ID
     */
    getEquipmentByTypeAndTest(equipType: string, testId: number): Observable<Equipment[]> {
        const equipment = this.mockEquipment.filter(
            e => e.equipType === equipType && e.testId === testId && !e.exclude
        );
        return of(equipment);
    }

    /**
     * Get equipment by ID
     */
    getEquipmentById(id: number): Observable<Equipment | null> {
        const equipment = this.mockEquipment.find(e => e.id === id);
        return of(equipment || null);
    }

    /**
     * Get equipment by name
     */
    getEquipmentByName(equipName: string): Observable<Equipment | null> {
        const equipment = this.mockEquipment.find(e => e.equipName === equipName);
        return of(equipment || null);
    }

    /**
     * Get all equipment types
     */
    getEquipmentTypes(): Observable<EquipmentType[]> {
        return of(this.equipmentTypes);
    }

    /**
     * Get equipment types for a specific test
     */
    getEquipmentTypesForTest(testId: number): Observable<EquipmentType[]> {
        const types = this.equipmentTypes.filter(type => type.testIds.includes(testId));
        return of(types);
    }

    /**
     * Get overdue equipment
     */
    getOverdueEquipment(): Observable<Equipment[]> {
        const today = new Date();
        const overdue = this.mockEquipment.filter(e => {
            if (!e.dueDate) return false;
            return e.dueDate < today && !e.exclude;
        });
        return of(overdue);
    }

    /**
     * Get equipment expiring within specified days
     */
    getEquipmentExpiringWithinDays(days: number): Observable<Equipment[]> {
        const today = new Date();
        const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));

        const expiring = this.mockEquipment.filter(e => {
            if (!e.dueDate || e.exclude) return false;
            return e.dueDate >= today && e.dueDate <= futureDate;
        });
        return of(expiring);
    }

    /**
     * Add new equipment
     */
    addEquipment(equipment: Omit<Equipment, 'id' | 'isOverdue'>): Observable<Equipment> {
        const newId = Math.max(...this.mockEquipment.map(e => e.id)) + 1;
        const newEquipment: Equipment = {
            ...equipment,
            id: newId,
            isOverdue: equipment.dueDate ? equipment.dueDate < new Date() : false
        };

        this.mockEquipment.push(newEquipment);
        return of(newEquipment);
    }

    /**
     * Update equipment
     */
    updateEquipment(id: number, updates: Partial<Equipment>): Observable<Equipment | null> {
        const index = this.mockEquipment.findIndex(e => e.id === id);
        if (index === -1) return of(null);

        const updatedEquipment = {
            ...this.mockEquipment[index],
            ...updates,
            isOverdue: updates.dueDate ? updates.dueDate < new Date() : this.mockEquipment[index].isOverdue
        };

        this.mockEquipment[index] = updatedEquipment;
        return of(updatedEquipment);
    }

    /**
     * Delete equipment (mark as excluded)
     */
    deleteEquipment(id: number): Observable<boolean> {
        const index = this.mockEquipment.findIndex(e => e.id === id);
        if (index === -1) return of(false);

        this.mockEquipment[index].exclude = true;
        return of(true);
    }

    /**
     * Get viscometer calibration data
     */
    getViscometerCalibration(equipName: string): Observable<{ calibration: number; tubeSize: number } | null> {
        const equipment = this.mockEquipment.find(e => e.equipName === equipName && e.equipType === 'VISCOMETER');
        if (!equipment) return of(null);

        return of({
            calibration: equipment.val1 || 0,
            tubeSize: equipment.val2 || 0
        });
    }

    /**
     * Check if equipment is suitable for test
     */
    isEquipmentSuitableForTest(equipName: string, testId: number): Observable<boolean> {
        const equipment = this.mockEquipment.find(e => e.equipName === equipName);
        if (!equipment || equipment.exclude) return of(false);

        return of(equipment.testId === testId);
    }

    /**
     * Get equipment status
     */
    getEquipmentStatus(equipName: string): Observable<'Available' | 'Overdue' | 'Expiring' | 'Excluded'> {
        const equipment = this.mockEquipment.find(e => e.equipName === equipName);
        if (!equipment) return of('Excluded');

        if (equipment.exclude) return of('Excluded');
        if (equipment.isOverdue) return of('Overdue');

        if (equipment.dueDate) {
            const daysUntilDue = Math.ceil((equipment.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntilDue <= 30) return of('Expiring');
        }

        return of('Available');
    }

    /**
     * Get equipment suffix for display
     */
    getEquipmentSuffix(equipName: string): Observable<string> {
        const equipment = this.mockEquipment.find(e => e.equipName === equipName);
        if (!equipment) return of('');

        let suffix = '';

        if (equipment.isOverdue) {
            suffix += '*';
        }

        if (equipment.dueDate) {
            const daysUntilDue = Math.ceil((equipment.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntilDue <= 30 && daysUntilDue > 0) {
                suffix += '*';
            }
        }

        if (equipment.suffix) {
            suffix += equipment.suffix;
        }

        return of(suffix);
    }

    /**
     * Get equipment with due date information
     */
    getEquipmentWithDueDateInfo(equipName: string): Observable<{ equipment: Equipment; dueDateInfo: string } | null> {
        const equipment = this.mockEquipment.find(e => e.equipName === equipName);
        if (!equipment) return of(null);

        let dueDateInfo = '';
        if (equipment.dueDate) {
            const daysUntilDue = Math.ceil((equipment.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntilDue < 0) {
                dueDateInfo = `Overdue by ${Math.abs(daysUntilDue)} days`;
            } else if (daysUntilDue === 0) {
                dueDateInfo = 'Due today';
            } else if (daysUntilDue <= 30) {
                dueDateInfo = `Due in ${daysUntilDue} days`;
            } else {
                dueDateInfo = `Due ${equipment.dueDate.toLocaleDateString()}`;
            }
        } else {
            dueDateInfo = 'No due date';
        }

        return of({ equipment, dueDateInfo });
    }

    /**
     * Get equipment usage statistics
     */
    getEquipmentUsageStats(): Observable<{ [equipType: string]: number }> {
        const stats: { [equipType: string]: number } = {};

        this.mockEquipment.forEach(equipment => {
            if (!equipment.exclude) {
                stats[equipment.equipType] = (stats[equipment.equipType] || 0) + 1;
            }
        });

        return of(stats);
    }

    /**
     * Get equipment maintenance schedule
     */
    getMaintenanceSchedule(): Observable<Equipment[]> {
        const today = new Date();
        const nextMonth = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

        const schedule = this.mockEquipment.filter(e => {
            if (!e.dueDate || e.exclude) return false;
            return e.dueDate >= today && e.dueDate <= nextMonth;
        });

        // Sort by due date
        schedule.sort((a, b) => {
            if (!a.dueDate || !b.dueDate) return 0;
            return a.dueDate.getTime() - b.dueDate.getTime();
        });

        return of(schedule);
    }

    /**
     * Validate equipment selection for a test
     */
    validateEquipmentForTest(equipName: string, testId: number, equipType: string): Observable<{ isValid: boolean; message: string }> {
        const equipment = this.mockEquipment.find(e => e.equipName === equipName);

        if (!equipment) {
            return of({ isValid: false, message: 'Equipment not found' });
        }

        if (equipment.exclude) {
            return of({ isValid: false, message: 'Equipment is excluded from use' });
        }

        if (equipment.equipType !== equipType) {
            return of({ isValid: false, message: `Equipment type mismatch. Expected ${equipType}, got ${equipment.equipType}` });
        }

        if (equipment.testId !== testId) {
            return of({ isValid: false, message: `Equipment not suitable for test ID ${testId}` });
        }

        if (equipment.isOverdue) {
            return of({ isValid: false, message: 'Equipment calibration is overdue' });
        }

        return of({ isValid: true, message: 'Equipment is valid for use' });
    }
}
