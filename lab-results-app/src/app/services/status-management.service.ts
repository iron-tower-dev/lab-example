import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface TestStatus {
    code: string;
    description: string;
    color: string;
    canTransitionTo: string[];
    requiresReview: boolean;
    isFinal: boolean;
}

export interface StatusTransition {
    fromStatus: string;
    toStatus: string;
    allowed: boolean;
    reason?: string;
}

export interface TestWorkflow {
    testId: number;
    statusFlow: string[];
    reviewRequired: boolean;
    partialSaveAllowed: boolean;
    deleteAllowed: boolean;
}

export interface TestResultStatus {
    sampleId: number;
    testId: number;
    trialNumber: number;
    status: string;
    entryId: string;
    entryDate: Date;
    reviewId?: string;
    reviewDate?: Date;
    comments?: string;
}

@Injectable({
    providedIn: 'root'
})
export class StatusManagementService {
    private http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:5005/api/mock';

    /**
     * Get all test statuses
     */
    getAllStatuses(): Observable<TestStatus[]> {
        return this.http.get<TestStatus[]>(`${this.apiUrl}/statuses`);
    }

    /**
     * Get status by code
     */
    getStatusByCode(code: string): Observable<TestStatus | null> {
        return this.http.get<TestStatus>(`${this.apiUrl}/statuses/${code}`);
    }

    /**
     * Get workflow for a specific test
     */
    getTestWorkflow(testId: number): Observable<TestWorkflow | null> {
        return this.http.get<TestWorkflow>(`${this.apiUrl}/statuses/test/${testId}/workflow`);
    }

    /**
     * Check if status transition is allowed
     */
    isStatusTransitionAllowed(fromStatus: string, toStatus: string, testId: number): Observable<StatusTransition> {
        return this.http.get<StatusTransition>(`${this.apiUrl}/statuses/transition/${fromStatus}/${toStatus}/test/${testId}`);
    }

    /**
     * Get next possible statuses for a given status and test
     */
    getNextPossibleStatuses(currentStatus: string, testId: number): Observable<TestStatus[]> {
        return this.http.get<TestStatus[]>(`${this.apiUrl}/statuses/${currentStatus}/next/test/${testId}`);
    }

    /**
     * Check if test requires review at current status
     */
    requiresReview(status: string): Observable<boolean> {
        return this.http.get<{ requiresReview: boolean }>(`${this.apiUrl}/statuses/${status}/requires-review`).pipe(
            map(response => response.requiresReview)
        );
    }

    /**
     * Check if status is final
     */
    isFinalStatus(status: string): Observable<boolean> {
        return this.http.get<{ isFinal: boolean }>(`${this.apiUrl}/statuses/${status}/is-final`).pipe(
            map(response => response.isFinal)
        );
    }

    /**
     * Get status color for display
     */
    getStatusColor(status: string): Observable<string> {
        return this.http.get<{ color: string }>(`${this.apiUrl}/statuses/${status}/color`).pipe(
            map(response => response.color)
        );
    }

    /**
     * Get status description
     */
    getStatusDescription(status: string): Observable<string> {
        return this.http.get<{ description: string }>(`${this.apiUrl}/statuses/${status}/description`).pipe(
            map(response => response.description)
        );
    }

    /**
     * Check if partial save is allowed for a test
     */
    isPartialSaveAllowed(testId: number): Observable<boolean> {
        return this.http.get<{ allowed: boolean }>(`${this.apiUrl}/statuses/test/${testId}/partial-save-allowed`).pipe(
            map(response => response.allowed)
        );
    }

    /**
     * Check if delete is allowed for a test
     */
    isDeleteAllowed(testId: number): Observable<boolean> {
        return this.http.get<{ allowed: boolean }>(`${this.apiUrl}/statuses/test/${testId}/delete-allowed`).pipe(
            map(response => response.allowed)
        );
    }

    /**
     * Check if review is required for a test
     */
    isReviewRequired(testId: number): Observable<boolean> {
        return this.http.get<{ required: boolean }>(`${this.apiUrl}/statuses/test/${testId}/review-required`).pipe(
            map(response => response.required)
        );
    }

    /**
     * Get appropriate status for partial save
     */
    getPartialSaveStatus(testId: number, userQualification: string): Observable<string> {
        return this.http.get<{ status: string }>(`${this.apiUrl}/statuses/test/${testId}/partial-save-status/${userQualification}`).pipe(
            map(response => response.status)
        );
    }

    /**
     * Get appropriate status for full save
     */
    getFullSaveStatus(testId: number, userQualification: string): Observable<string> {
        return this.http.get<{ status: string }>(`${this.apiUrl}/statuses/test/${testId}/full-save-status/${userQualification}`).pipe(
            map(response => response.status)
        );
    }

    /**
     * Get appropriate status for media ready
     */
    getMediaReadyStatus(testId: number): Observable<string> {
        return this.http.get<{ status: string }>(`${this.apiUrl}/statuses/test/${testId}/media-ready-status`).pipe(
            map(response => response.status)
        );
    }

    /**
     * Get appropriate status for training
     */
    getTrainingStatus(): Observable<string> {
        return this.http.get<{ status: string }>(`${this.apiUrl}/statuses/training-status`).pipe(
            map(response => response.status)
        );
    }

    /**
     * Get appropriate status for validation
     */
    getValidationStatus(): Observable<string> {
        return this.http.get<{ status: string }>(`${this.apiUrl}/statuses/validation-status`).pipe(
            map(response => response.status)
        );
    }

    /**
     * Get appropriate status for cancellation
     */
    getCancellationStatus(): Observable<string> {
        return this.http.get<{ status: string }>(`${this.apiUrl}/statuses/cancellation-status`).pipe(
            map(response => response.status)
        );
    }

    /**
     * Check if user can perform action based on status and qualification
     */
    canPerformAction(
        action: string,
        currentStatus: string,
        testId: number,
        userQualification: string
    ): Observable<boolean> {
        return this.http.get<{ canPerform: boolean }>(`${this.apiUrl}/statuses/action/${action}/current/${currentStatus}/test/${testId}/qualification/${userQualification}`).pipe(
            map(response => response.canPerform)
        );
    }

    /**
     * Get status workflow for display
     */
    getStatusWorkflowForDisplay(testId: number): Observable<{ status: string; description: string; color: string }[]> {
        return this.http.get<{ status: string; description: string; color: string }[]>(`${this.apiUrl}/statuses/test/${testId}/workflow-display`);
    }

    /**
     * Get status statistics for a test
     */
    getStatusStatistics(testId: number): Observable<{ [status: string]: number }> {
        return this.http.get<{ [status: string]: number }>(`${this.apiUrl}/statuses/test/${testId}/statistics`);
    }

    /**
     * Get overdue tests (tests that have been in a non-final status too long)
     */
    getOverdueTests(): Observable<TestResultStatus[]> {
        return this.http.get<TestResultStatus[]>(`${this.apiUrl}/statuses/overdue-tests`);
    }

    /**
     * Get tests pending review
     */
    getTestsPendingReview(): Observable<TestResultStatus[]> {
        return this.http.get<TestResultStatus[]>(`${this.apiUrl}/statuses/pending-review`);
    }
}
