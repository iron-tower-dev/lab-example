import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

export interface UserQualification {
    employeeId: string;
    testStandId: number;
    testStand: string;
    qualificationLevel: string;
}

export interface TestStand {
    id: number;
    name: string;
}

export interface QualificationLevel {
    level: string;
    description: string;
    permissions: string[];
}

@Injectable({
    providedIn: 'root'
})
export class UserQualificationService {
    private http = inject(HttpClient);

    // Mock data for development - in production this would come from the API
    private readonly mockQualifications: UserQualification[] = [
        { employeeId: 'USER1', testStandId: 1, testStand: 'General Lab', qualificationLevel: 'Q/QAG' },
        { employeeId: 'USER1', testStandId: 2, testStand: 'Microscopy', qualificationLevel: 'MicrE' },
        { employeeId: 'USER2', testStandId: 1, testStand: 'General Lab', qualificationLevel: 'TRAIN' },
        { employeeId: 'USER3', testStandId: 1, testStand: 'General Lab', qualificationLevel: 'Q/QAG' },
        { employeeId: 'USER3', testStandId: 2, testStand: 'Microscopy', qualificationLevel: 'MicrE' }
    ];

    private readonly mockTestStands: TestStand[] = [
        { id: 1, name: 'General Lab' },
        { id: 2, name: 'Microscopy' },
        { id: 3, name: 'Specialized Testing' }
    ];

    private readonly qualificationLevels: QualificationLevel[] = [
        {
            level: 'Q/QAG',
            description: 'Qualified/Quality Assurance Qualified',
            permissions: ['enter', 'review', 'accept', 'reject', 'delete']
        },
        {
            level: 'MicrE',
            description: 'Microscopy Expert',
            permissions: ['enter', 'review', 'accept', 'reject', 'delete', 'microscopy']
        },
        {
            level: 'TRAIN',
            description: 'Training',
            permissions: ['enter', 'partial_save']
        }
    ];

    /**
     * Get user qualifications for a specific user
     */
    getUserQualifications(userId: string): Observable<UserQualification[]> {
        // In production, this would make an HTTP call to the API
        const qualifications = this.mockQualifications.filter(q => q.employeeId === userId);
        return of(qualifications);
    }

    /**
     * Check if user is qualified for a specific test
     */
    isUserQualified(userId: string, testId: number): Observable<string | null> {
        return this.getUserQualifications(userId).pipe(
            map(qualifications => {
                const testStandId = this.getTestStandIdForTest(testId);
                const qualification = qualifications.find(q => q.testStandId === testStandId);
                return qualification ? qualification.qualificationLevel : null;
            })
        );
    }

    /**
     * Check if user is qualified to review results for a specific test
     */
    isUserQualifiedToReview(userId: string, testId: number): Observable<string | null> {
        return this.isUserQualified(userId, testId).pipe(
            map(qualification => {
                if (qualification === 'Q/QAG' || qualification === 'MicrE') {
                    return qualification;
                }
                return null;
            })
        );
    }

    /**
     * Check if user can perform a specific action
     */
    canUserPerformAction(userId: string, testId: number, action: string): Observable<boolean> {
        return this.isUserQualified(userId, testId).pipe(
            map(qualification => {
                if (!qualification) return false;

                const level = this.qualificationLevels.find(l => l.level === qualification);
                return level ? level.permissions.includes(action) : false;
            })
        );
    }

    /**
     * Get all test stands
     */
    getTestStands(): Observable<TestStand[]> {
        return of(this.mockTestStands);
    }

    /**
     * Get all qualification levels
     */
    getQualificationLevels(): Observable<QualificationLevel[]> {
        return of(this.qualificationLevels);
    }

    /**
     * Add or update user qualification
     */
    saveUserQualification(qualification: UserQualification): Observable<UserQualification> {
        // In production, this would make an HTTP call to save the qualification
        const existingIndex = this.mockQualifications.findIndex(
            q => q.employeeId === qualification.employeeId && q.testStandId === qualification.testStandId
        );

        if (existingIndex >= 0) {
            this.mockQualifications[existingIndex] = qualification;
        } else {
            this.mockQualifications.push(qualification);
        }

        return of(qualification);
    }

    /**
     * Remove user qualification
     */
    removeUserQualification(employeeId: string, testStandId: number): Observable<boolean> {
        // In production, this would make an HTTP call to remove the qualification
        const index = this.mockQualifications.findIndex(
            q => q.employeeId === employeeId && q.testStandId === testStandId
        );

        if (index >= 0) {
            this.mockQualifications.splice(index, 1);
            return of(true);
        }

        return of(false);
    }

    /**
     * Get users by qualification level for a specific test
     */
    getUsersByQualification(testId: number, qualificationLevel: string): Observable<UserQualification[]> {
        const testStandId = this.getTestStandIdForTest(testId);
        const users = this.mockQualifications.filter(
            q => q.testStandId === testStandId && q.qualificationLevel === qualificationLevel
        );
        return of(users);
    }

    /**
     * Check if user can enter results for a test
     */
    canEnterResults(userId: string, testId: number): Observable<boolean> {
        return this.canUserPerformAction(userId, testId, 'enter');
    }

    /**
     * Check if user can review results for a test
     */
    canReviewResults(userId: string, testId: number): Observable<boolean> {
        return this.canUserPerformAction(userId, testId, 'review');
    }

    /**
     * Check if user can accept results for a test
     */
    canAcceptResults(userId: string, testId: number): Observable<boolean> {
        return this.canUserPerformAction(userId, testId, 'accept');
    }

    /**
     * Check if user can reject results for a test
     */
    canRejectResults(userId: string, testId: number): Observable<boolean> {
        return this.canUserPerformAction(userId, testId, 'reject');
    }

    /**
     * Check if user can delete results for a test
     */
    canDeleteResults(userId: string, testId: number): Observable<boolean> {
        return this.canUserPerformAction(userId, testId, 'delete');
    }

    /**
     * Check if user can perform partial saves for a test
     */
    canPartialSave(userId: string, testId: number): Observable<boolean> {
        return this.canUserPerformAction(userId, testId, 'partial_save');
    }

    /**
     * Check if user has microscopy permissions
     */
    hasMicroscopyPermissions(userId: string): Observable<boolean> {
        return this.getUserQualifications(userId).pipe(
            map(qualifications => {
                return qualifications.some(q => q.qualificationLevel === 'MicrE');
            })
        );
    }

    /**
     * Get the test stand ID for a specific test
     */
    private getTestStandIdForTest(testId: number): number {
        // Map test IDs to test stand IDs
        const testStandMapping: { [testId: number]: number } = {
            10: 1,   // TAN - General Lab
            20: 1,   // File Data - General Lab
            30: 1,   // Emission Spectro (New) - General Lab
            40: 1,   // Emission Spectro (Used) - General Lab
            50: 1,   // Viscosity 40°C - General Lab
            60: 1,   // Viscosity 100°C - General Lab
            70: 1,   // FTIR - General Lab
            80: 1,   // Flash Point - General Lab
            110: 1,  // Simple Result - General Lab
            120: 2,  // Filter Inspection - Microscopy
            130: 1,  // Grease Penetration - General Lab
            140: 1,  // Grease Dropping Point - General Lab
            160: 1,  // Particle Count - General Lab
            170: 1,  // RBOT - General Lab
            180: 2,  // Filter Residue - Microscopy
            210: 2,  // Ferrogram - Microscopy
            220: 1,  // Oxidation Stability - General Lab
            230: 1,  // RBOT Fail Time - General Lab
            240: 2,  // Inspect Filter - Microscopy
            250: 1,  // Deleterious - General Lab
            270: 1,  // Simple Select - General Lab
            284: 1,  // Rheometer D-inch - General Lab
            285: 1,  // Rheometer Oil Content - General Lab
            286: 1   // Rheometer Varnish Potential - General Lab
        };

        return testStandMapping[testId] || 1; // Default to General Lab
    }

    /**
     * Get qualification level description
     */
    getQualificationDescription(level: string): string {
        const qualification = this.qualificationLevels.find(l => l.level === level);
        return qualification ? qualification.description : level;
    }

    /**
     * Get permissions for a qualification level
     */
    getPermissionsForLevel(level: string): string[] {
        const qualification = this.qualificationLevels.find(l => l.level === level);
        return qualification ? qualification.permissions : [];
    }

    /**
     * Check if a qualification level has a specific permission
     */
    hasPermission(level: string, permission: string): boolean {
        const permissions = this.getPermissionsForLevel(level);
        return permissions.includes(permission);
    }

    /**
     * Get the highest qualification level for a user across all test stands
     */
    getHighestQualificationLevel(userId: string): Observable<string | null> {
        return this.getUserQualifications(userId).pipe(
            map(qualifications => {
                if (qualifications.length === 0) return null;

                // Priority order: MicrE > Q/QAG > TRAIN
                const priority = { 'MicrE': 3, 'Q/QAG': 2, 'TRAIN': 1 };

                let highest = qualifications[0];
                for (const qual of qualifications) {
                    if (priority[qual.qualificationLevel] > priority[highest.qualificationLevel]) {
                        highest = qual;
                    }
                }

                return highest.qualificationLevel;
            })
        );
    }

    /**
     * Check if user is a supervisor (has Q/QAG or MicrE qualifications)
     */
    isSupervisor(userId: string): Observable<boolean> {
        return this.getHighestQualificationLevel(userId).pipe(
            map(level => level === 'Q/QAG' || level === 'MicrE')
        );
    }

    /**
     * Get all users with supervisor privileges
     */
    getSupervisors(): Observable<UserQualification[]> {
        const supervisors = this.mockQualifications.filter(
            q => q.qualificationLevel === 'Q/QAG' || q.qualificationLevel === 'MicrE'
        );
        return of(supervisors);
    }
}
