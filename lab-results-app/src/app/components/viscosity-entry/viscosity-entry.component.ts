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
import { ViscosityTestDto } from '../../models/test-result.models';

@Component({
  selector: 'app-viscosity-entry',
  template: `
    <mat-card class="test-entry-card">
      <mat-card-header>
        <mat-card-title>Viscosity Test Entry</mat-card-title>
        <mat-card-subtitle>{{ testId() === 50 ? '40°C Viscosity' : '100°C Viscosity' }} Test</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="viscosityForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Thermometer MTE#</mat-label>
              <mat-select formControlName="thermometerMteId">
                <mat-option value="">Select Thermometer</mat-option>
                <!-- Equipment options would be populated from service -->
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Timer MTE#</mat-label>
              <mat-select formControlName="timerMteId">
                <mat-option value="">Select Timer</mat-option>
                <!-- Equipment options would be populated from service -->
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Viscometer ID</mat-label>
              <mat-select formControlName="viscometerId" (selectionChange)="onViscometerChange()">
                <mat-option value="">Select Viscometer</mat-option>
                <!-- Equipment options would be populated from service -->
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Stop Watch Time (seconds)</mat-label>
              <input matInput 
                     type="number" 
                     step="0.01"
                     formControlName="stopWatchTime"
                     (blur)="calculateViscosity()"
                     placeholder="Enter stop watch time">
              <mat-error *ngIf="viscosityForm.get('stopWatchTime')?.hasError('required')">
                Stop watch time is required
              </mat-error>
              <mat-error *ngIf="viscosityForm.get('stopWatchTime')?.hasError('min')">
                Stop watch time must be greater than 0
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>cSt Result</mat-label>
              <input matInput 
                     type="number" 
                     step="0.01"
                     formControlName="cstResult"
                     readonly
                     placeholder="Calculated viscosity result">
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
                [disabled]="!viscosityForm.valid || !viscosityForm.get('isSelected')?.value"
                [loading]="isLoading()">
          <mat-icon>save</mat-icon>
          Save Viscosity Test
        </button>
        
        <button mat-button 
                (click)="onClear()"
                [disabled]="isLoading()">
          <mat-icon>clear</mat-icon>
          Clear
        </button>
        
        <button mat-button 
                (click)="onPartialSave()"
                [disabled]="!viscosityForm.get('isSelected')?.value || isLoading()">
          <mat-icon>save_alt</mat-icon>
          Partial Save
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .test-entry-card {
      max-width: 800px;
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
export class ViscosityEntryComponent {
  private fb = inject(FormBuilder);
  private testResultService = inject(TestResultService);
  private snackBar = inject(MatSnackBar);

  // Inputs
  sampleId = input.required<number>();
  testId = input.required<number>();
  trialNumber = input.required<number>();
  existingData = input<ViscosityTestDto | null>(null);

  // Outputs
  saved = output<ViscosityTestDto>();
  cleared = output<void>();

  // Signals
  isLoading = signal(false);
  calibrationFactor = signal<number>(0);

  // Form
  viscosityForm: FormGroup;

  constructor() {
    this.viscosityForm = this.fb.group({
      thermometerMteId: [''],
      timerMteId: [''],
      viscometerId: [''],
      stopWatchTime: [0, [Validators.required, Validators.min(0.01)]],
      cstResult: [0, Validators.required],
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
      this.viscosityForm.patchValue({
        thermometerMteId: data.thermometerMteId,
        timerMteId: data.timerMteId,
        viscometerId: data.viscometerId,
        stopWatchTime: data.stopWatchTime,
        cstResult: data.cstResult,
        comments: data.comments,
        isSelected: true
      });
    }
  }

  onViscometerChange(): void {
    const viscometerId = this.viscosityForm.get('viscometerId')?.value;
    if (viscometerId) {
      // In a real implementation, this would fetch the calibration factor from the service
      // For now, we'll use a placeholder value
      this.calibrationFactor.set(1.0);
      this.calculateViscosity();
    }
  }

  calculateViscosity(): void {
    const stopTime = this.viscosityForm.get('stopWatchTime')?.value;
    const calibration = this.calibrationFactor();

    if (stopTime && calibration > 0) {
      // Viscosity calculation: calibration * stopTime
      const result = calibration * stopTime;
      const roundedResult = Math.round(result * 100) / 100;
      
      this.viscosityForm.patchValue({ cstResult: roundedResult });
    }
  }

  onSubmit(): void {
    if (this.viscosityForm.valid && this.viscosityForm.get('isSelected')?.value) {
      this.saveTestResult('S'); // Saved status
    }
  }

  onPartialSave(): void {
    if (this.viscosityForm.get('isSelected')?.value) {
      this.saveTestResult('A'); // Accepted status for partial save
    }
  }

  onClear(): void {
    this.viscosityForm.reset({
      thermometerMteId: '',
      timerMteId: '',
      viscometerId: '',
      stopWatchTime: 0,
      cstResult: 0,
      comments: '',
      isSelected: true
    });
    this.calibrationFactor.set(0);
    this.cleared.emit();
  }

  private saveTestResult(status: string): void {
    if (!this.viscosityForm.valid) return;

    const formValue = this.viscosityForm.value;
    
    const viscosityTestDto: ViscosityTestDto = {
      sampleId: this.sampleId(),
      testId: this.testId(),
      trialNumber: this.trialNumber(),
      thermometerMteId: formValue.thermometerMteId,
      timerMteId: formValue.timerMteId,
      viscometerId: formValue.viscometerId,
      stopWatchTime: formValue.stopWatchTime,
      cstResult: formValue.cstResult,
      status: status,
      comments: formValue.comments,
      entryId: 'CURRENT_USER', // This would come from authentication
      entryDate: new Date()
    };

    this.isLoading.set(true);

    this.testResultService.saveViscosityTest(viscosityTestDto).subscribe({
      next: (result) => {
        this.isLoading.set(false);
        this.saved.emit(result);
        this.snackBar.open('Viscosity test saved successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        this.isLoading.set(false);
        this.snackBar.open('Error saving Viscosity test: ' + error.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }
}