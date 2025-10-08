import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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
    private readonly apiUrl = 'http://localhost:5005/api/mock';

    /**
     * Get all equipment
     */
    getAllEquipment(): Observable<Equipment[]> {
        return this.http.get<Equipment[]>(`${this.apiUrl}/equipment`);
    }

    /**
     * Get equipment by type
     */
    getEquipmentByType(equipType: string): Observable<Equipment[]> {
        return this.http.get<Equipment[]>(`${this.apiUrl}/equipment/type/${equipType}`);
    }

    /**
     * Get equipment for a specific test
     */
    getEquipmentForTest(testId: number): Observable<Equipment[]> {
        return this.http.get<Equipment[]>(`${this.apiUrl}/equipment/test/${testId}`);
    }

    /**
     * Get equipment by type and test ID
     */
    getEquipmentByTypeAndTest(equipType: string, testId: number): Observable<Equipment[]> {
        return this.http.get<Equipment[]>(`${this.apiUrl}/equipment/type/${equipType}/test/${testId}`);
    }

    /**
     * Get equipment by ID
     */
    getEquipmentById(id: number): Observable<Equipment | null> {
        return this.http.get<Equipment>(`${this.apiUrl}/equipment/id/${id}`);
    }

    /**
     * Get equipment by name
     */
    getEquipmentByName(equipName: string): Observable<Equipment | null> {
        return this.http.get<Equipment>(`${this.apiUrl}/equipment/name/${equipName}`);
    }

    /**
     * Get all equipment types
     */
    getEquipmentTypes(): Observable<EquipmentType[]> {
        return this.http.get<EquipmentType[]>(`${this.apiUrl}/equipment/types`);
    }

    /**
     * Get equipment types for a specific test
     */
    getEquipmentTypesForTest(testId: number): Observable<EquipmentType[]> {
        return this.http.get<EquipmentType[]>(`${this.apiUrl}/equipment/types/test/${testId}`);
    }

    /**
     * Get overdue equipment
     */
    getOverdueEquipment(): Observable<Equipment[]> {
        return this.http.get<Equipment[]>(`${this.apiUrl}/equipment/overdue`);
    }

    /**
     * Get equipment expiring within specified days
     */
    getEquipmentExpiringWithinDays(days: number): Observable<Equipment[]> {
        return this.http.get<Equipment[]>(`${this.apiUrl}/equipment/expiring/${days}`);
    }

    /**
     * Add new equipment
     */
    addEquipment(equipment: Omit<Equipment, 'id' | 'isOverdue'>): Observable<Equipment> {
        return this.http.post<Equipment>(`${this.apiUrl}/equipment`, equipment);
    }

    /**
     * Update equipment
     */
    updateEquipment(id: number, updates: Partial<Equipment>): Observable<Equipment | null> {
        return this.http.put<Equipment>(`${this.apiUrl}/equipment/${id}`, updates);
    }

    /**
     * Delete equipment (mark as excluded)
     */
    deleteEquipment(id: number): Observable<boolean> {
        return this.http.delete(`${this.apiUrl}/equipment/${id}`).pipe(
            map(() => true)
        );
    }

    /**
     * Get viscometer calibration data
     */
    getViscometerCalibration(equipName: string): Observable<{ calibration: number; tubeSize: number } | null> {
        return this.http.get<{ calibration: number; tubeSize: number }>(`${this.apiUrl}/equipment/viscometer/${equipName}/calibration`);
    }

    /**
     * Check if equipment is suitable for test
     */
    isEquipmentSuitableForTest(equipName: string, testId: number): Observable<boolean> {
        return this.http.get<{ isSuitable: boolean }>(`${this.apiUrl}/equipment/${equipName}/suitable/${testId}`).pipe(
            map(response => response.isSuitable)
        );
    }

    /**
     * Get equipment status
     */
    getEquipmentStatus(equipName: string): Observable<'Available' | 'Overdue' | 'Expiring' | 'Excluded'> {
        return this.http.get<{ status: string }>(`${this.apiUrl}/equipment/${equipName}/status`).pipe(
            map(response => response.status as 'Available' | 'Overdue' | 'Expiring' | 'Excluded')
        );
    }

    /**
     * Get equipment suffix for display
     */
    getEquipmentSuffix(equipName: string): Observable<string> {
        return this.http.get<{ suffix: string }>(`${this.apiUrl}/equipment/${equipName}/suffix`).pipe(
            map(response => response.suffix)
        );
    }

    /**
     * Get equipment with due date information
     */
    getEquipmentWithDueDateInfo(equipName: string): Observable<{ equipment: Equipment; dueDateInfo: string } | null> {
        return this.http.get<{ equipment: Equipment; dueDateInfo: string }>(`${this.apiUrl}/equipment/${equipName}/due-date-info`);
    }

    /**
     * Get equipment usage statistics
     */
    getEquipmentUsageStats(): Observable<{ [equipType: string]: number }> {
        return this.http.get<{ [equipType: string]: number }>(`${this.apiUrl}/equipment/usage-stats`);
    }

    /**
     * Get equipment maintenance schedule
     */
    getMaintenanceSchedule(): Observable<Equipment[]> {
        return this.http.get<Equipment[]>(`${this.apiUrl}/equipment/maintenance-schedule`);
    }

    /**
     * Validate equipment selection for a test
     */
    validateEquipmentForTest(equipName: string, testId: number, equipType: string): Observable<{ isValid: boolean; message: string }> {
        return this.http.get<{ isValid: boolean; message: string }>(`${this.apiUrl}/equipment/${equipName}/validate/${testId}/${equipType}`);
    }
}
