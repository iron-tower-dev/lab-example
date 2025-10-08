import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

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

    // Test status definitions
    private readonly testStatuses: TestStatus[] = [
        {
            code: 'X',
            description: 'Not Started',
            color: '#6c757d',
            canTransitionTo: ['T', 'S', 'A', 'P'],
            requiresReview: false,
            isFinal: false
        },
        {
            code: 'T',
            description: 'Training',
            color: '#ffc107',
            canTransitionTo: ['S', 'A', 'P', 'E'],
            requiresReview: false,
            isFinal: false
        },
        {
            code: 'A',
            description: 'Accepted (Partial)',
            color: '#17a2b8',
            canTransitionTo: ['S', 'P', 'E'],
            requiresReview: false,
            isFinal: false
        },
        {
            code: 'P',
            description: 'Partial',
            color: '#fd7e14',
            canTransitionTo: ['S', 'E'],
            requiresReview: false,
            isFinal: false
        },
        {
            code: 'E',
            description: 'Ready for Microscope',
            color: '#6f42c1',
            canTransitionTo: ['S', 'D'],
            requiresReview: true,
            isFinal: false
        },
        {
            code: 'S',
            description: 'Saved',
            color: '#28a745',
            canTransitionTo: ['D'],
            requiresReview: true,
            isFinal: false
        },
        {
            code: 'D',
            description: 'Validated',
            color: '#007bff',
            canTransitionTo: [],
            requiresReview: false,
            isFinal: true
        },
        {
            code: 'C',
            description: 'Cancelled',
            color: '#dc3545',
            canTransitionTo: [],
            requiresReview: false,
            isFinal: true
        }
    ];

    // Test-specific workflows
    private readonly testWorkflows: { [testId: number]: TestWorkflow } = {
        10: { // TAN
            testId: 10,
            statusFlow: ['X', 'T', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: false,
            deleteAllowed: true
        },
        30: { // Emission Spectro (New)
            testId: 30,
            statusFlow: ['X', 'T', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: false,
            deleteAllowed: true
        },
        40: { // Emission Spectro (Used)
            testId: 40,
            statusFlow: ['X', 'T', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: false,
            deleteAllowed: true
        },
        50: { // Viscosity 40°C
            testId: 50,
            statusFlow: ['X', 'T', 'A', 'P', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: true,
            deleteAllowed: true
        },
        60: { // Viscosity 100°C
            testId: 60,
            statusFlow: ['X', 'T', 'A', 'P', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: true,
            deleteAllowed: true
        },
        70: { // FTIR
            testId: 70,
            statusFlow: ['X', 'T', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: false,
            deleteAllowed: true
        },
        80: { // Flash Point
            testId: 80,
            statusFlow: ['X', 'T', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: false,
            deleteAllowed: true
        },
        110: { // Simple Result
            testId: 110,
            statusFlow: ['X', 'T', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: false,
            deleteAllowed: true
        },
        120: { // Filter Inspection
            testId: 120,
            statusFlow: ['X', 'T', 'A', 'E', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: true,
            deleteAllowed: true
        },
        130: { // Grease Penetration
            testId: 130,
            statusFlow: ['X', 'T', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: false,
            deleteAllowed: true
        },
        140: { // Grease Dropping Point
            testId: 140,
            statusFlow: ['X', 'T', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: false,
            deleteAllowed: true
        },
        160: { // Particle Count
            testId: 160,
            statusFlow: ['X', 'T', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: false,
            deleteAllowed: true
        },
        170: { // RBOT
            testId: 170,
            statusFlow: ['X', 'T', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: false,
            deleteAllowed: true
        },
        180: { // Filter Residue
            testId: 180,
            statusFlow: ['X', 'T', 'A', 'E', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: true,
            deleteAllowed: true
        },
        210: { // Ferrogram
            testId: 210,
            statusFlow: ['X', 'T', 'A', 'P', 'E', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: true,
            deleteAllowed: true
        },
        220: { // Oxidation Stability
            testId: 220,
            statusFlow: ['X', 'T', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: false,
            deleteAllowed: true
        },
        230: { // RBOT Fail Time
            testId: 230,
            statusFlow: ['X', 'T', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: false,
            deleteAllowed: true
        },
        240: { // Inspect Filter
            testId: 240,
            statusFlow: ['X', 'T', 'A', 'E', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: true,
            deleteAllowed: true
        },
        250: { // Deleterious
            testId: 250,
            statusFlow: ['X', 'T', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: false,
            deleteAllowed: true
        },
        270: { // Simple Select
            testId: 270,
            statusFlow: ['X', 'T', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: false,
            deleteAllowed: true
        },
        284: { // Rheometer D-inch
            testId: 284,
            statusFlow: ['X', 'T', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: false,
            deleteAllowed: true
        },
        285: { // Rheometer Oil Content
            testId: 285,
            statusFlow: ['X', 'T', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: false,
            deleteAllowed: true
        },
        286: { // Rheometer Varnish Potential
            testId: 286,
            statusFlow: ['X', 'T', 'S', 'D'],
            reviewRequired: true,
            partialSaveAllowed: false,
            deleteAllowed: true
        }
    };

    /**
     * Get all test statuses
     */
    getAllStatuses(): Observable<TestStatus[]> {
        return of(this.testStatuses);
    }

    /**
     * Get status by code
     */
    getStatusByCode(code: string): Observable<TestStatus | null> {
        const status = this.testStatuses.find(s => s.code === code);
        return of(status || null);
    }

    /**
     * Get workflow for a specific test
     */
    getTestWorkflow(testId: number): Observable<TestWorkflow | null> {
        const workflow = this.testWorkflows[testId];
        return of(workflow || null);
    }

    /**
     * Check if status transition is allowed
     */
    isStatusTransitionAllowed(fromStatus: string, toStatus: string, testId: number): Observable<StatusTransition> {
        const fromStatusObj = this.testStatuses.find(s => s.code === fromStatus);
        const workflow = this.testWorkflows[testId];

        if (!fromStatusObj || !workflow) {
            return of({
                fromStatus,
                toStatus,
                allowed: false,
                reason: 'Invalid status or test workflow not found'
            });
        }

        const allowed = fromStatusObj.canTransitionTo.includes(toStatus) &&
            workflow.statusFlow.includes(toStatus);

        return of({
            fromStatus,
            toStatus,
            allowed,
            reason: allowed ? undefined : 'Status transition not allowed for this test'
        });
    }

    /**
     * Get next possible statuses for a given status and test
     */
    getNextPossibleStatuses(currentStatus: string, testId: number): Observable<TestStatus[]> {
        const currentStatusObj = this.testStatuses.find(s => s.code === currentStatus);
        const workflow = this.testWorkflows[testId];

        if (!currentStatusObj || !workflow) {
            return of([]);
        }

        const possibleStatuses = currentStatusObj.canTransitionTo
            .filter(statusCode => workflow.statusFlow.includes(statusCode))
            .map(statusCode => this.testStatuses.find(s => s.code === statusCode))
            .filter(status => status !== undefined) as TestStatus[];

        return of(possibleStatuses);
    }

    /**
     * Check if test requires review at current status
     */
    requiresReview(status: string): Observable<boolean> {
        const statusObj = this.testStatuses.find(s => s.code === status);
        return of(statusObj ? statusObj.requiresReview : false);
    }

    /**
     * Check if status is final
     */
    isFinalStatus(status: string): Observable<boolean> {
        const statusObj = this.testStatuses.find(s => s.code === status);
        return of(statusObj ? statusObj.isFinal : false);
    }

    /**
     * Get status color for display
     */
    getStatusColor(status: string): Observable<string> {
        const statusObj = this.testStatuses.find(s => s.code === status);
        return of(statusObj ? statusObj.color : '#6c757d');
    }

    /**
     * Get status description
     */
    getStatusDescription(status: string): Observable<string> {
        const statusObj = this.testStatuses.find(s => s.code === status);
        return of(statusObj ? statusObj.description : 'Unknown Status');
    }

    /**
     * Check if partial save is allowed for a test
     */
    isPartialSaveAllowed(testId: number): Observable<boolean> {
        const workflow = this.testWorkflows[testId];
        return of(workflow ? workflow.partialSaveAllowed : false);
    }

    /**
     * Check if delete is allowed for a test
     */
    isDeleteAllowed(testId: number): Observable<boolean> {
        const workflow = this.testWorkflows[testId];
        return of(workflow ? workflow.deleteAllowed : false);
    }

    /**
     * Check if review is required for a test
     */
    isReviewRequired(testId: number): Observable<boolean> {
        const workflow = this.testWorkflows[testId];
        return of(workflow ? workflow.reviewRequired : true);
    }

    /**
     * Get appropriate status for partial save
     */
    getPartialSaveStatus(testId: number, userQualification: string): Observable<string> {
        if (testId === 210) { // Ferrogram
            return of('P'); // Partial status for Ferrogram
        } else {
            return of('A'); // Accepted status for other tests
        }
    }

    /**
     * Get appropriate status for full save
     */
    getFullSaveStatus(testId: number, userQualification: string): Observable<string> {
        return of('S'); // Saved status
    }

    /**
     * Get appropriate status for media ready
     */
    getMediaReadyStatus(testId: number): Observable<string> {
        return of('E'); // Ready for Microscope
    }

    /**
     * Get appropriate status for training
     */
    getTrainingStatus(): Observable<string> {
        return of('T'); // Training status
    }

    /**
     * Get appropriate status for validation
     */
    getValidationStatus(): Observable<string> {
        return of('D'); // Validated status
    }

    /**
     * Get appropriate status for cancellation
     */
    getCancellationStatus(): Observable<string> {
        return of('C'); // Cancelled status
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
        switch (action) {
            case 'enter':
                return of(['X', 'T', 'A', 'P'].includes(currentStatus));

            case 'partial_save':
                return this.isPartialSaveAllowed(testId).pipe(
                    map(allowed => allowed && ['X', 'T', 'A', 'P'].includes(currentStatus))
                );

            case 'full_save':
                return of(['X', 'T', 'A', 'P'].includes(currentStatus));

            case 'media_ready':
                return of(['X', 'T', 'A', 'P', 'S'].includes(currentStatus));

            case 'review':
                return this.requiresReview(currentStatus).pipe(
                    map(required => required && (userQualification === 'Q/QAG' || userQualification === 'MicrE'))
                );

            case 'accept':
                return of(['E', 'S'].includes(currentStatus) &&
                    (userQualification === 'Q/QAG' || userQualification === 'MicrE'));

            case 'reject':
                return of(['E', 'S'].includes(currentStatus) &&
                    (userQualification === 'Q/QAG' || userQualification === 'MicrE'));

            case 'delete':
                return this.isDeleteAllowed(testId).pipe(
                    map(allowed => allowed && ['T', 'A', 'P', 'E', 'S'].includes(currentStatus) &&
                        (userQualification === 'Q/QAG' || userQualification === 'MicrE'))
                );

            case 'clear':
                return of(['X', 'T', 'A', 'P'].includes(currentStatus));

            default:
                return of(false);
        }
    }

    /**
     * Get status workflow for display
     */
    getStatusWorkflowForDisplay(testId: number): Observable<{ status: string; description: string; color: string }[]> {
        const workflow = this.testWorkflows[testId];
        if (!workflow) return of([]);

        const workflowDisplay = workflow.statusFlow.map(statusCode => {
            const status = this.testStatuses.find(s => s.code === statusCode);
            return {
                status: statusCode,
                description: status ? status.description : 'Unknown',
                color: status ? status.color : '#6c757d'
            };
        });

        return of(workflowDisplay);
    }

    /**
     * Get status statistics for a test
     */
    getStatusStatistics(testId: number): Observable<{ [status: string]: number }> {
        // This would typically query the database for actual statistics
        // For now, return mock data
        const mockStats = {
            'X': 5,
            'T': 3,
            'A': 2,
            'P': 1,
            'E': 4,
            'S': 8,
            'D': 12,
            'C': 1
        };

        return of(mockStats);
    }

    /**
     * Get overdue tests (tests that have been in a non-final status too long)
     */
    getOverdueTests(): Observable<TestResultStatus[]> {
        // This would typically query the database for tests that have been
        // in a non-final status for too long
        const mockOverdue: TestResultStatus[] = [
            {
                sampleId: 1001,
                testId: 50,
                trialNumber: 1,
                status: 'T',
                entryId: 'USER1',
                entryDate: new Date('2024-01-01')
            },
            {
                sampleId: 1002,
                testId: 120,
                trialNumber: 1,
                status: 'E',
                entryId: 'USER2',
                entryDate: new Date('2024-01-02')
            }
        ];

        return of(mockOverdue);
    }

    /**
     * Get tests pending review
     */
    getTestsPendingReview(): Observable<TestResultStatus[]> {
        // This would typically query the database for tests that require review
        const mockPending: TestResultStatus[] = [
            {
                sampleId: 1003,
                testId: 70,
                trialNumber: 1,
                status: 'S',
                entryId: 'USER3',
                entryDate: new Date('2024-01-03')
            },
            {
                sampleId: 1004,
                testId: 210,
                trialNumber: 1,
                status: 'E',
                entryId: 'USER4',
                entryDate: new Date('2024-01-04')
            }
        ];

        return of(mockPending);
    }
}
