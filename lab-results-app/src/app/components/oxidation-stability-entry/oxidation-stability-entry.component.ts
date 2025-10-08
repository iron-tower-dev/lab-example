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
import { MatRadioModule } from '@angular/material/radio';
import { TestResultService } from '../../services/test-result.service';
import { OxidationStabilityTestDto } from '../../models/test-result.models';

@Component({
    selector: 'app-oxidation-stability-entry',
    template: `
    <mat-card class="test-entry-card">
      <mat-card-header>
        <mat-card-title>Oxidation Stability Test Entry</mat-card-title>
        <mat-card-subtitle>Oxidation Stability Test</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="oxidationStabilityForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Thermometer MTE#</mat-label>
              <mat-select formControlName="thermometerMteId">
                <mat-option value="">Select Thermometer</mat-option>
                <!-- Equipment options would be populated from service -->
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-label class="result-label">Test Result:</mat-label>
            <mat-radio-group formControlName="passFailResult" class="radio-group">
              <mat-radio-button value="1">Pass</mat-radio-button>
              <mat-radio-button value="2">Fail - Light</mat-radio-button>
              <mat-radio-button value="3">Fail - Moderate</mat-radio-button>
              <mat-radio-button value="4">Fail - Severe</mat-radio-button>
            </mat-radio-group>
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
                [disabled]="!oxidationStabilityForm.valid || !oxidationStabilityForm.get('isSelected')?.value"
                [loading]="isLoading()">
          <mat-icon>save</mat-icon>
          Save Oxidation Stability Test
        </button>
        
        <button mat-button 
                (click)="onClear()"
                [disabled]="isLoading()">
          <mat-icon>clear</mat-icon>
          Clear
        </button>
        
        <button mat-button 
                (click)="onPartialSave()"
                [disabled]="!oxidationStabilityForm.get('isSelected')?.value || isLoading()">
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
    
    .result-label {
      font-weight: 500;
      margin-bottom: 8px;
      display: block;
    }
    
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
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
        MatSnackBarModule,
        MatRadioModule
    ]
})
export class OxidationStabilityEntryComponent {
    private fb = inject(FormBuilder);
    private testResultService = inject(TestResultService);
    private snackBar = inject(MatSnackBar);

    // Inputs
    sampleId = input.required<number>();
    testId = input.required<number>();
    trialNumber = input.required<number>();
    existingData = input<OxidationStabilityTestDto | null>(null);

    // Outputs
    saved = output<OxidationStabilityTestDto>();
    cleared = output<void>();

    // Signals
    isLoading = signal(false);

    // Form
    oxidationStabilityForm: FormGroup;

    constructor() {
        this.oxidationStabilityForm = this.fb.group({
            thermometerMteId: [''],
            passFailResult: [1, Validators.required], // Default to Pass
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
            this.oxidationStabilityForm.patchValue({
                thermometerMteId: data.thermometerMteId,
                passFailResult: data.passFailResult,
                comments: data.comments,
                isSelected: true
            });
        }
    }

    onSubmit(): void {
        if (this.oxidationStabilityForm.valid && this.oxidationStabilityForm.get('isSelected')?.value) {
            this.saveTestResult('S'); // Saved status
        }
    }

    onPartialSave(): void {
        if (this.oxidationStabilityForm.get('isSelected')?.value) {
            this.saveTestResult('A'); // Accepted status for partial save
        }
    }

    onClear(): void {
        this.oxidationStabilityForm.reset({
            thermometerMteId: '',
            passFailResult: 1,
            comments: '',
            isSelected: true
        });
        this.cleared.emit();
    }

    private saveTestResult(status: string): void {
        if (!this.oxidationStabilityForm.valid) return;

        const formValue = this.oxidationStabilityForm.value;

        const oxidationStabilityTestDto: OxidationStabilityTestDto = {
            sampleId: this.sampleId(),
            testId: this.testId(),
            trialNumber: this.trialNumber(),
            thermometerMteId: formValue.thermometerMteId,
            passFailResult: parseInt(formValue.passFailResult),
            status: status,
            comments: formValue.comments,
            entryId: 'CURRENT_USER', // This would come from authentication
            entryDate: new Date()
        };

        this.isLoading.set(true);

        this.testResultService.saveOxidationStabilityTest(oxidationStabilityTestDto).subscribe({
            next: (result) => {
                this.isLoading.set(false);
                this.saved.emit(result);
                this.snackBar.open('Oxidation Stability test saved successfully', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            },
            error: (error) => {
                this.isLoading.set(false);
                this.snackBar.open('Error saving Oxidation Stability test: ' + error.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            }
        });
    }
}
