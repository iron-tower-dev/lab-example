import { Component, input, output, signal, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TestResultService } from '../../services/test-result.service';
import { TestResultEntry } from '../../models/test-result.models';

@Component({
    selector: 'app-simple-result-entry',
    template: `
    <mat-card class="test-entry-card">
      <mat-card-header>
        <mat-card-title>Simple Result Test Entry</mat-card-title>
        <mat-card-subtitle>Basic Test Result Entry</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="simpleResultForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Result</mat-label>
              <input matInput 
                     type="number" 
                     step="0.001"
                     formControlName="result"
                     placeholder="Enter test result">
              <mat-error *ngIf="simpleResultForm.get('result')?.hasError('required')">
                Result is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>Comments</mat-label>
              <textarea matInput 
                        formControlName="comments"
                        rows="3"
                        placeholder="Enter any comments or observations">
              </textarea>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-checkbox formControlName="isSelected" class="select-checkbox">
              Select this trial for saving
            </mat-checkbox>
          </div>
        </form>
      </mat-card-content>

      <mat-card-actions>
        <button mat-raised-button 
                color="primary" 
                (click)="onSubmit()"
                [disabled]="!simpleResultForm.valid || !simpleResultForm.get('isSelected')?.value"
                [loading]="isLoading()">
          <mat-icon>save</mat-icon>
          Save Simple Result Test
        </button>
        
        <button mat-button 
                (click)="onClear()"
                [disabled]="isLoading()">
          <mat-icon>clear</mat-icon>
          Clear
        </button>
        
        <button mat-button 
                (click)="onPartialSave()"
                [disabled]="!simpleResultForm.get('isSelected')?.value || isLoading()">
          <mat-icon>save_alt</mat-icon>
          Partial Save
        </button>
      </mat-card-actions>
    </mat-card>
  `,
    styles: [`
    .test-entry-card {
      max-width: 600px;
      margin: 20px auto;
    }
    
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      align-items: flex-start;
    }
    
    .form-field {
      flex: 1;
      min-width: 200px;
    }
    
    .full-width {
      flex: 1 1 100%;
    }
    
    .select-checkbox {
      margin: 16px 0;
    }
    
    mat-card-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    
    .mat-mdc-form-field {
      width: 100%;
    }
  `],
    imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatCheckboxModule,
        MatIconModule,
        MatSnackBarModule
    ]
})
export class SimpleResultEntryComponent {
    private fb = inject(FormBuilder);
    private testResultService = inject(TestResultService);
    private snackBar = inject(MatSnackBar);

    // Inputs
    sampleId = input.required<number>();
    testId = input.required<number>();
    trialNumber = input.required<number>();
    existingData = input<TestResultEntry | null>(null);

    // Outputs
    saved = output<TestResultEntry>();
    cleared = output<void>();

    // Signals
    isLoading = signal(false);

    // Form
    simpleResultForm: FormGroup;

    constructor() {
        this.simpleResultForm = this.fb.group({
            result: [null, Validators.required],
            comments: [''],
            isSelected: [true]
        });

        // Load existing data if provided
        if (this.existingData()) {
            this.loadExistingData();
        }
    }

    private loadExistingData(): void {
        const data = this.existingData();
        if (data) {
            this.simpleResultForm.patchValue({
                result: data.value1,
                comments: data.mainComments,
                isSelected: true
            });
        }
    }

    onSubmit(): void {
        if (this.simpleResultForm.valid && this.simpleResultForm.get('isSelected')?.value) {
            this.saveTestResult('S'); // Saved status
        }
    }

    onPartialSave(): void {
        if (this.simpleResultForm.get('isSelected')?.value) {
            this.saveTestResult('A'); // Accepted status for partial save
        }
    }

    onClear(): void {
        this.simpleResultForm.reset({
            result: null,
            comments: '',
            isSelected: true
        });
        this.cleared.emit();
    }

    private saveTestResult(status: string): void {
        if (!this.simpleResultForm.valid) return;

        const formValue = this.simpleResultForm.value;

        const testResultEntry: TestResultEntry = {
            sampleId: this.sampleId(),
            testId: this.testId(),
            trialNumber: this.trialNumber(),
            value1: formValue.result,
            status: status,
            mainComments: formValue.comments,
            isPartialSave: status === 'A'
        };

        this.isLoading.set(true);

        // Use the general test result save method
        this.testResultService.saveTestResults({
            sampleId: this.sampleId(),
            testId: this.testId(),
            mode: 'entry',
            entries: [testResultEntry],
            isPartialSave: status === 'A',
            isMediaReady: false,
            isDelete: false
        }).subscribe({
            next: (result) => {
                this.isLoading.set(false);
                this.saved.emit(testResultEntry);
                this.snackBar.open('Simple result test saved successfully', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            },
            error: (error) => {
                this.isLoading.set(false);
                this.snackBar.open('Error saving Simple result test: ' + error.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            }
        });
    }
}
