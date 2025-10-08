import { Component, Input, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil, combineLatest } from 'rxjs';

import { TestResultService } from '../../services/test-result.service';
import {
    TestResultEntry,
    SampleInfo,
    TestInfo,
    UserQualification,
    Equipment,
    TestMode,
    QualificationLevel
} from '../../models/test-result.models';

@Component({
    selector: 'app-test-result-entry',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatRadioModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule
    ],
    template: `
    <div class="test-result-entry">
      @if (loading()) {
        <mat-spinner></mat-spinner>
      } @else {
        <!-- Sample Information Header -->
        <mat-card class="sample-info-card">
          <mat-card-header>
            <mat-card-title>{{ testInfo()?.name || 'Test Entry' }}</mat-card-title>
            <mat-card-subtitle>
              Sample #{{ sampleInfo()?.id }} | {{ sampleInfo()?.tagNumber }} | 
              {{ sampleInfo()?.componentName }} ({{ sampleInfo()?.component }}) | 
              {{ sampleInfo()?.locationName }} ({{ sampleInfo()?.location }})
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="sample-details">
              <div><strong>Lube Type:</strong> {{ sampleInfo()?.lubeType }}</div>
              <div><strong>Quality Class:</strong> {{ sampleInfo()?.qualityClass }}</div>
              @if (sampleInfo()?.cnrText) {
                <div class="cnr-info" [style.background-color]="sampleInfo()?.cnrColor" 
                     [style.color]="sampleInfo()?.fColor">
                  {{ sampleInfo()?.cnrText }}
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Test Entry Form -->
        <mat-card class="entry-form-card">
          <mat-card-content>
            <form [formGroup]="entryForm" (ngSubmit)="onSubmit()">
              <!-- Dynamic form fields based on test type -->
              @if (testInfo()?.id) {
                <ng-container [ngSwitch]="testInfo()!.id">
                  <!-- TAN Test (10) -->
                  @case (10) {
                    <app-tan-entry [formGroup]="entryForm" [equipment]="equipment()"></app-tan-entry>
                  }
                  
                  <!-- Viscosity Tests (50, 60) -->
                  @case (50; 60) {
                    <app-viscosity-entry [formGroup]="entryForm" [equipment]="equipment()" 
                                        [lubeType]="sampleInfo()?.lubeType || ''"></app-viscosity-entry>
                  }
                  
                  <!-- FTIR Test (70) -->
                  @case (70) {
                    <app-ftir-entry [formGroup]="entryForm"></app-ftir-entry>
                  }
                  
                  <!-- Particle Analysis Tests (120, 180, 210, 240) -->
                  @case (120; 180; 210; 240) {
                    <app-particle-analysis-entry [formGroup]="entryForm" 
                                                [particleTypes]="particleTypes()"
                                                [testId]="testInfo()!.id"></app-particle-analysis-entry>
                  }
                  
                  <!-- Default generic entry -->
                  @default {
                    <app-generic-entry [formGroup]="entryForm" [equipment]="equipment()"></app-generic-entry>
                  }
                </ng-container>
              }

              <!-- Action Buttons -->
              <div class="action-buttons">
                @if (canEnter()) {
                  <button mat-raised-button color="primary" type="submit" [disabled]="!entryForm.valid || saving()">
                    @if (saving()) {
                      <mat-spinner diameter="20"></mat-spinner>
                    } @else {
                      Save
                    }
                  </button>
                  
                  @if (canPartialSave()) {
                    <button mat-button type="button" (click)="onPartialSave()" [disabled]="saving()">
                      Partial Save
                    </button>
                  }
                  
                  @if (canMediaReady()) {
                    <button mat-button type="button" (click)="onMediaReady()" [disabled]="saving()">
                      Media Ready
                    </button>
                  }
                  
                  <button mat-button type="button" (click)="onClear()">
                    Clear
                  </button>
                }
                
                @if (canReview()) {
                  <button mat-raised-button color="accent" type="button" (click)="onAccept()" [disabled]="saving()">
                    Accept
                  </button>
                  <button mat-button color="warn" type="button" (click)="onReject()" [disabled]="saving()">
                    Reject
                  </button>
                }
                
                <button mat-button type="button" (click)="onCancel()">
                  Cancel
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
    styles: [`
    .test-result-entry {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .sample-info-card, .entry-form-card {
      margin-bottom: 20px;
    }
    
    .sample-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
    }
    
    .cnr-info {
      padding: 8px;
      border-radius: 4px;
      font-weight: bold;
    }
    
    .action-buttons {
      display: flex;
      gap: 10px;
      margin-top: 20px;
      flex-wrap: wrap;
    }
    
    .action-buttons button {
      min-width: 120px;
    }
  `]
})
export class TestResultEntryComponent implements OnInit, OnDestroy {
    @Input() sampleId!: number;
    @Input() testId!: number;
    @Input() mode: TestMode = 'entry';

    private readonly fb = inject(FormBuilder);
    private readonly testResultService = inject(TestResultService);
    private readonly snackBar = inject(MatSnackBar);
    private readonly destroy$ = new Subject<void>();

    // Signals for reactive state
    loading = signal(true);
    saving = signal(false);
    sampleInfo = signal<SampleInfo | null>(null);
    testInfo = signal<TestInfo | null>(null);
    userQualification = signal<UserQualification | null>(null);
    equipment = signal<Equipment[]>([]);
    particleTypes = signal<any[]>([]);

    // Computed properties
    canEnter = computed(() => {
        const qual = this.userQualification();
        return qual?.canEnter && this.mode === 'entry';
    });

    canReview = computed(() => {
        const qual = this.userQualification();
        return qual?.canReview && this.mode === 'review';
    });

    canPartialSave = computed(() => {
        const qual = this.userQualification();
        const test = this.testInfo();
        return qual?.canEnter && test && [120, 180, 210, 240].includes(test.id);
    });

    canMediaReady = computed(() => {
        const qual = this.userQualification();
        const test = this.testInfo();
        return qual?.canEnter && test && [120, 180, 210, 240].includes(test.id);
    });

    entryForm!: FormGroup;

    ngOnInit(): void {
        this.initializeForm();
        this.loadData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initializeForm(): void {
        this.entryForm = this.fb.group({
            entries: this.fb.array([]),
            isPartialSave: [false],
            isMediaReady: [false],
            isDelete: [false]
        });
    }

    private loadData(): void {
        this.loading.set(true);

        combineLatest([
            this.testResultService.getSampleInfo(this.sampleId),
            this.testResultService.getTestInfo(this.testId),
            this.testResultService.getUserQualification('TEST001', this.testId),
            this.testResultService.getTestResults(this.sampleId, this.testId)
        ]).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: ([sampleInfo, testInfo, qualification, results]) => {
                this.sampleInfo.set(sampleInfo);
                this.testInfo.set(testInfo);
                this.userQualification.set(qualification);

                this.initializeFormEntries(results);
                this.loadEquipment();

                if ([120, 180, 210, 240].includes(testInfo.id)) {
                    this.loadParticleTypes();
                }

                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading data:', error);
                this.snackBar.open('Error loading test data', 'Close', { duration: 3000 });
                this.loading.set(false);
            }
        });
    }

    private initializeFormEntries(results: TestResultEntry[]): void {
        const entriesArray = this.entryForm.get('entries') as FormArray;
        entriesArray.clear();

        if (results.length === 0) {
            // Add default entry
            entriesArray.push(this.createEntryFormGroup());
        } else {
            results.forEach(result => {
                entriesArray.push(this.createEntryFormGroup(result));
            });
        }
    }

    private createEntryFormGroup(data?: TestResultEntry): FormGroup {
        return this.fb.group({
            sampleId: [this.sampleId],
            testId: [this.testId],
            trialNumber: [data?.trialNumber || 1],
            value1: [data?.value1],
            value2: [data?.value2],
            value3: [data?.value3],
            trialCalc: [data?.trialCalc],
            id1: [data?.id1],
            id2: [data?.id2],
            id3: [data?.id3],
            status: [data?.status],
            mainComments: [data?.mainComments],
            isSelected: [true]
        });
    }

    private loadEquipment(): void {
        const test = this.testInfo();
        if (!test) return;

        // Load equipment based on test type
        const equipmentTypes = this.getEquipmentTypesForTest(test.id);

        equipmentTypes.forEach(type => {
            this.testResultService.getEquipment(type, test.id).pipe(
                takeUntil(this.destroy$)
            ).subscribe(equipment => {
                this.equipment.update(current => [...current, ...equipment]);
            });
        });
    }

    private loadParticleTypes(): void {
        this.testResultService.getParticleTypes(this.sampleId, this.testId).pipe(
            takeUntil(this.destroy$)
        ).subscribe(particleTypes => {
            this.particleTypes.set(particleTypes);
        });
    }

    private getEquipmentTypesForTest(testId: number): string[] {
        switch (testId) {
            case 10: return ['THERMOMETER'];
            case 50:
            case 60: return ['THERMOMETER', 'TIMER', 'VISCOMETER'];
            case 80: return ['BAROMETER', 'THERMOMETER'];
            case 130: return [];
            case 140: return ['THERMOMETER'];
            case 170:
            case 230: return ['THERMOMETER'];
            case 220: return ['THERMOMETER'];
            case 250: return ['DELETERIOUS'];
            default: return [];
        }
    }

    onSubmit(): void {
        if (this.entryForm.valid) {
            this.saveResults('entry');
        }
    }

    onPartialSave(): void {
        this.entryForm.patchValue({ isPartialSave: true });
        this.saveResults('entry');
    }

    onMediaReady(): void {
        this.entryForm.patchValue({ isMediaReady: true });
        this.saveResults('entry');
    }

    onAccept(): void {
        this.saveResults('reviewaccept');
    }

    onReject(): void {
        this.saveResults('reviewreject');
    }

    onClear(): void {
        this.entryForm.reset();
        this.initializeFormEntries([]);
    }

    onCancel(): void {
        // Navigate back or close
        window.history.back();
    }

    private saveResults(mode: string): void {
        this.saving.set(true);

        const formValue = this.entryForm.value;
        const saveData = {
            sampleId: this.sampleId,
            testId: this.testId,
            mode: mode,
            entries: formValue.entries.filter((entry: any) => entry.isSelected),
            isPartialSave: formValue.isPartialSave,
            isMediaReady: formValue.isMediaReady,
            isDelete: formValue.isDelete
        };

        this.testResultService.saveTestResults(saveData).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (response) => {
                this.saving.set(false);
                if (response.success) {
                    this.snackBar.open('Results saved successfully', 'Close', { duration: 3000 });
                    this.loadData(); // Reload to get updated data
                } else {
                    this.snackBar.open(response.errorMessage || 'Error saving results', 'Close', { duration: 5000 });
                }
            },
            error: (error) => {
                this.saving.set(false);
                console.error('Error saving results:', error);
                this.snackBar.open('Error saving results', 'Close', { duration: 3000 });
            }
        });
    }
}
