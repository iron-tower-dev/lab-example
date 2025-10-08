import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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
    private readonly apiUrl = 'http://localhost:5005/api/mock';

    /**
     * Get user qualifications for a specific user
     */
    getUserQualifications(userId: string): Observable<UserQualification[]> {
        return this.http.get<UserQualification[]>(`${this.apiUrl}/qualifications/user/${userId}`);
    }

    /**
     * Check if user is qualified for a specific test
     */
    isUserQualified(userId: string, testId: number): Observable<string | null> {
        return this.http.get<{ qualification: string | null }>(`${this.apiUrl}/qualifications/user/${userId}/test/${testId}`).pipe(
            map(response => response.qualification)
        );
    }

    /**
     * Check if user is qualified to review results for a specific test
     */
    isUserQualifiedToReview(userId: string, testId: number): Observable<string | null> {
        return this.http.get<{ qualification: string | null }>(`${this.apiUrl}/qualifications/user/${userId}/test/${testId}/review`).pipe(
            map(response => response.qualification)
        );
    }

    /**
     * Check if user can perform a specific action
     */
    canUserPerformAction(userId: string, testId: number, action: string): Observable<boolean> {
        return this.http.get<{ canPerform: boolean }>(`${this.apiUrl}/qualifications/user/${userId}/test/${testId}/action/${action}`).pipe(
            map(response => response.canPerform)
        );
    }

    /**
     * Get all test stands
     */
    getTestStands(): Observable<TestStand[]> {
        return this.http.get<TestStand[]>(`${this.apiUrl}/qualifications/test-stands`);
    }

    /**
     * Get all qualification levels
     */
    getQualificationLevels(): Observable<QualificationLevel[]> {
        return this.http.get<QualificationLevel[]>(`${this.apiUrl}/qualifications/levels`);
    }

    /**
     * Add or update user qualification
     */
    saveUserQualification(qualification: UserQualification): Observable<UserQualification> {
        return this.http.post<UserQualification>(`${this.apiUrl}/qualifications`, qualification);
    }

    /**
     * Remove user qualification
     */
    removeUserQualification(employeeId: string, testStandId: number): Observable<boolean> {
        return this.http.delete(`${this.apiUrl}/qualifications/user/${employeeId}/test-stand/${testStandId}`).pipe(
            map(() => true)
        );
    }

    /**
     * Get users by qualification level for a specific test
     */
    getUsersByQualification(testId: number, qualificationLevel: string): Observable<UserQualification[]> {
        return this.http.get<UserQualification[]>(`${this.apiUrl}/qualifications/test/${testId}/level/${qualificationLevel}`);
    }

    /**
     * Check if user can enter results for a test
     */
    canEnterResults(userId: string, testId: number): Observable<boolean> {
        return this.http.get<{ canEnter: boolean }>(`${this.apiUrl}/qualifications/user/${userId}/test/${testId}/can-enter`).pipe(
            map(response => response.canEnter)
        );
    }

    /**
     * Check if user can review results for a test
     */
    canReviewResults(userId: string, testId: number): Observable<boolean> {
        return this.http.get<{ canReview: boolean }>(`${this.apiUrl}/qualifications/user/${userId}/test/${testId}/can-review`).pipe(
            map(response => response.canReview)
        );
    }

    /**
     * Check if user can accept results for a test
     */
    canAcceptResults(userId: string, testId: number): Observable<boolean> {
        return this.http.get<{ canAccept: boolean }>(`${this.apiUrl}/qualifications/user/${userId}/test/${testId}/can-accept`).pipe(
            map(response => response.canAccept)
        );
    }

    /**
     * Check if user can reject results for a test
     */
    canRejectResults(userId: string, testId: number): Observable<boolean> {
        return this.http.get<{ canReject: boolean }>(`${this.apiUrl}/qualifications/user/${userId}/test/${testId}/can-reject`).pipe(
            map(response => response.canReject)
        );
    }

    /**
     * Check if user can delete results for a test
     */
    canDeleteResults(userId: string, testId: number): Observable<boolean> {
        return this.http.get<{ canDelete: boolean }>(`${this.apiUrl}/qualifications/user/${userId}/test/${testId}/can-delete`).pipe(
            map(response => response.canDelete)
        );
    }

    /**
     * Check if user can perform partial saves for a test
     */
    canPartialSave(userId: string, testId: number): Observable<boolean> {
        return this.http.get<{ canPartialSave: boolean }>(`${this.apiUrl}/qualifications/user/${userId}/test/${testId}/can-partial-save`).pipe(
            map(response => response.canPartialSave)
        );
    }

    /**
     * Check if user has microscopy permissions
     */
    hasMicroscopyPermissions(userId: string): Observable<boolean> {
        return this.http.get<{ hasPermissions: boolean }>(`${this.apiUrl}/qualifications/user/${userId}/microscopy-permissions`).pipe(
            map(response => response.hasPermissions)
        );
    }

    /**
     * Get qualification level description
     */
    getQualificationDescription(level: string): string {
        // This would typically come from the API, but for now we'll keep it local
        const qualificationLevels: { [key: string]: string } = {
            'Q/QAG': 'Qualified/Quality Assurance Qualified',
            'MicrE': 'Microscopy Expert',
            'TRAIN': 'Training'
        };
        return qualificationLevels[level] || level;
    }

    /**
     * Get permissions for a qualification level
     */
    getPermissionsForLevel(level: string): string[] {
        // This would typically come from the API, but for now we'll keep it local
        const permissions: { [key: string]: string[] } = {
            'Q/QAG': ['enter', 'review', 'accept', 'reject', 'delete'],
            'MicrE': ['enter', 'review', 'accept', 'reject', 'delete', 'microscopy'],
            'TRAIN': ['enter', 'partial_save']
        };
        return permissions[level] || [];
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
        return this.http.get<{ level: string | null }>(`${this.apiUrl}/qualifications/user/${userId}/highest-level`).pipe(
            map(response => response.level)
        );
    }

    /**
     * Check if user is a supervisor (has Q/QAG or MicrE qualifications)
     */
    isSupervisor(userId: string): Observable<boolean> {
        return this.http.get<{ isSupervisor: boolean }>(`${this.apiUrl}/qualifications/user/${userId}/is-supervisor`).pipe(
            map(response => response.isSupervisor)
        );
    }

    /**
     * Get all users with supervisor privileges
     */
    getSupervisors(): Observable<UserQualification[]> {
        return this.http.get<UserQualification[]>(`${this.apiUrl}/qualifications/supervisors`);
    }
}
