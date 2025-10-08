import { Component, input, output, signal, inject, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-simple-select-entry',
    template: `
    <mat-card class="test-entry-card">
      <mat-card-header>
        <mat-card-title>Simple Select Test Entry</mat-card-title>
        <mat-card-subtitle>Simple Selection Test</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="simpleSelectForm" (ngSubmit)="onSubmit()">
          <!-- Test Selection -->
          <div class="form-section">
            <h3>Test Selection</h3>
            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Select Test Result</mat-label>
                <mat-select formControlName="testResult">
                  <mat-option value="">Select a result</mat-option>
                  <mat-option value="pass">Pass</mat-option>
                  <mat-option value="fail">Fail</mat-option>
                  <mat-option value="pending">Pending</mat-option>
                  <mat-option value="not_applicable">Not Applicable</mat-option>
                </mat-select>
                <mat-error *ngIf="simpleSelectForm.get('testResult')?.hasError('required')">
                  Test result selection is required
                </mat-error>
              </mat-form-field>
            </div>
          </div>

          <!-- Comments -->
          <div class="form-section">
            <h3>Comments</h3>
            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>Test Comments</mat-label>
              <textarea matInput 
                        formControlName="comments"
                        rows="3"
                        placeholder="Enter any comments about the test">
              </textarea>
            </mat-form-field>
          </div>

          <!-- Save Selection -->
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
                [disabled]="!simpleSelectForm.valid || !simpleSelectForm.get('isSelected')?.value"
                [loading]="isLoading()">
          <mat-icon>save</mat-icon>
          Save Simple Select Test
        </button>
        
        <button mat-button 
                (click)="onClear()"
                [disabled]="isLoading()">
          <mat-icon>clear</mat-icon>
          Clear
        </button>
      </mat-card-actions>
    </mat-card>
  `,
    styles: [`
    .test-entry-card {
      max-width: 600px;
      margin: 20px auto;
    }
    
    .form-section {
      margin-bottom: 24px;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    
    .form-section h3 {
      margin-top: 0;
      color: #1976d2;
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
export class SimpleSelectEntryComponent implements OnInit {
    private fb = inject(FormBuilder);
    private testResultService = inject(TestResultService);
    private snackBar = inject(MatSnackBar);

    // Inputs
    sampleId = input.required<number>();
    testId = input.required<number>();
    trialNumber = input.required<number>();
    existingData = input<any | null>(null);

    // Outputs
    saved = output<any>();
    cleared = output<void>();

    // Signals
    isLoading = signal(false);

    // Form
    simpleSelectForm: FormGroup;

    constructor() {
        this.simpleSelectForm = this.fb.group({
            testResult: ['', Validators.required],
            comments: [''],
            isSelected: [true]
        });
    }

    ngOnInit(): void {
        this.loadExistingData();
    }

    private loadExistingData(): void {
        const existing = this.existingData();
        if (existing) {
            this.simpleSelectForm.patchValue({
                testResult: existing.value1 || '',
                comments: existing.mainComments || '',
                isSelected: true
            });
        }
    }

    onSubmit(): void {
        if (this.simpleSelectForm.valid && this.simpleSelectForm.get('isSelected')?.value) {
            this.saveTestResult();
        }
    }

    onClear(): void {
        this.simpleSelectForm.reset({
            testResult: '',
            comments: '',
            isSelected: true
        });

        this.cleared.emit();
    }

    private saveTestResult(): void {
        if (!this.simpleSelectForm.valid) return;

        const formValue = this.simpleSelectForm.value;

        const testResultData = {
            sampleId: this.sampleId(),
            testId: this.testId(),
            trialNumber: this.trialNumber(),
            testResult: formValue.testResult,
            comments: formValue.comments,
            status: 'S',
            entryId: 'CURRENT_USER',
            entryDate: new Date()
        };

        this.isLoading.set(true);

        // Use the general test result save method
        this.testResultService.saveTestResults({
            sampleId: this.sampleId(),
            testId: this.testId(),
            mode: 'entry',
            entries: [{
                sampleId: this.sampleId(),
                testId: this.testId(),
                trialNumber: this.trialNumber(),
                value1: formValue.testResult,
                status: 'S',
                mainComments: formValue.comments,
                isPartialSave: false,
                isMediaReady: false,
                isDelete: false
            }],
            isPartialSave: false,
            isMediaReady: false,
            isDelete: false
        }).subscribe({
            next: (result) => {
                this.isLoading.set(false);
                this.saved.emit(testResultData);
                this.snackBar.open('Simple Select test saved successfully', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            },
            error: (error) => {
                this.isLoading.set(false);
                this.snackBar.open('Error saving Simple Select test: ' + error.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            }
        });
    }
}
