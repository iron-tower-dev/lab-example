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
import { FlashPointTestDto } from '../../models/test-result.models';

@Component({
  selector: 'app-flash-point-entry',
  template: `
    <mat-card class="test-entry-card">
      <mat-card-header>
        <mat-card-title>Flash Point Test Entry</mat-card-title>
        <mat-card-subtitle>Flash Point Temperature Test</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="flashPointForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Barometer MTE#</mat-label>
              <mat-select formControlName="barometerMteId">
                <mat-option value="">Select Barometer</mat-option>
                <!-- Equipment options would be populated from service -->
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Thermometer MTE#</mat-label>
              <mat-select formControlName="thermometerMteId">
                <mat-option value="">Select Thermometer</mat-option>
                <!-- Equipment options would be populated from service -->
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Barometric Pressure (mm Hg)</mat-label>
              <input matInput 
                     type="number" 
                     step="0.1"
                     formControlName="barometricPressure"
                     (blur)="calculateFlashPoint()"
                     placeholder="Enter barometric pressure">
              <mat-error *ngIf="flashPointForm.get('barometricPressure')?.hasError('required')">
                Barometric pressure is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Flash Point Temperature (°F)</mat-label>
              <input matInput 
                     type="number" 
                     step="0.1"
                     formControlName="flashPointTemperature"
                     (blur)="calculateFlashPoint()"
                     placeholder="Enter flash point temperature">
              <mat-error *ngIf="flashPointForm.get('flashPointTemperature')?.hasError('required')">
                Flash point temperature is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Result (°F)</mat-label>
              <input matInput 
                     type="number" 
                     step="1"
                     formControlName="result"
                     readonly
                     placeholder="Calculated result">
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
                [disabled]="!flashPointForm.valid || !flashPointForm.get('isSelected')?.value"
                [loading]="isLoading()">
          <mat-icon>save</mat-icon>
          Save Flash Point Test
        </button>
        
        <button mat-button 
                (click)="onClear()"
                [disabled]="isLoading()">
          <mat-icon>clear</mat-icon>
          Clear
        </button>
        
        <button mat-button 
                (click)="onPartialSave()"
                [disabled]="!flashPointForm.get('isSelected')?.value || isLoading()">
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
export class FlashPointEntryComponent {
  private fb = inject(FormBuilder);
  private testResultService = inject(TestResultService);
  private snackBar = inject(MatSnackBar);

  // Inputs
  sampleId = input.required<number>();
  testId = input.required<number>();
  trialNumber = input.required<number>();
  existingData = input<FlashPointTestDto | null>(null);

  // Outputs
  saved = output<FlashPointTestDto>();
  cleared = output<void>();

  // Signals
  isLoading = signal(false);

  // Form
  flashPointForm: FormGroup;

  constructor() {
    this.flashPointForm = this.fb.group({
      barometerMteId: [''],
      thermometerMteId: [''],
      barometricPressure: [0, [Validators.required, Validators.min(0)]],
      flashPointTemperature: [0, [Validators.required, Validators.min(0)]],
      result: [0, Validators.required],
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
      this.flashPointForm.patchValue({
        barometerMteId: data.barometerMteId,
        thermometerMteId: data.thermometerMteId,
        barometricPressure: data.barometricPressure,
        flashPointTemperature: data.flashPointTemperature,
        result: data.result,
        comments: data.comments,
        isSelected: true
      });
    }
  }

  calculateFlashPoint(): void {
    const pressure = this.flashPointForm.get('barometricPressure')?.value;
    const flashPointTemp = this.flashPointForm.get('flashPointTemperature')?.value;

    if (pressure && flashPointTemp) {
      // Flash point calculation: FlashPointTemp + (0.06 * (760 - Pressure))
      const result = flashPointTemp + (0.06 * (760 - pressure));
      const roundedResult = Math.round(result / 2) * 2; // Round to nearest even number
      
      this.flashPointForm.patchValue({ result: roundedResult });
    }
  }

  onSubmit(): void {
    if (this.flashPointForm.valid && this.flashPointForm.get('isSelected')?.value) {
      this.saveTestResult('S'); // Saved status
    }
  }

  onPartialSave(): void {
    if (this.flashPointForm.get('isSelected')?.value) {
      this.saveTestResult('A'); // Accepted status for partial save
    }
  }

  onClear(): void {
    this.flashPointForm.reset({
      barometerMteId: '',
      thermometerMteId: '',
      barometricPressure: 0,
      flashPointTemperature: 0,
      result: 0,
      comments: '',
      isSelected: true
    });
    this.cleared.emit();
  }

  private saveTestResult(status: string): void {
    if (!this.flashPointForm.valid) return;

    const formValue = this.flashPointForm.value;
    
    const flashPointTestDto: FlashPointTestDto = {
      sampleId: this.sampleId(),
      testId: this.testId(),
      trialNumber: this.trialNumber(),
      barometerMteId: formValue.barometerMteId,
      thermometerMteId: formValue.thermometerMteId,
      barometricPressure: formValue.barometricPressure,
      flashPointTemperature: formValue.flashPointTemperature,
      result: formValue.result,
      status: status,
      comments: formValue.comments,
      entryId: 'CURRENT_USER', // This would come from authentication
      entryDate: new Date()
    };

    this.isLoading.set(true);

    this.testResultService.saveFlashPointTest(flashPointTestDto).subscribe({
      next: (result) => {
        this.isLoading.set(false);
        this.saved.emit(result);
        this.snackBar.open('Flash Point test saved successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        this.isLoading.set(false);
        this.snackBar.open('Error saving Flash Point test: ' + error.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }
}
