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
import { DroppingPointTestDto } from '../../models/test-result.models';

@Component({
    selector: 'app-dropping-point-entry',
    template: `
    <mat-card class="test-entry-card">
      <mat-card-header>
        <mat-card-title>Grease Dropping Point Test Entry</mat-card-title>
        <mat-card-subtitle>Dropping Point Temperature Test</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="droppingPointForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Dropping Point Thermometer</mat-label>
              <mat-select formControlName="droppingPointThermometerId">
                <mat-option value="">Select Dropping Point Thermometer</mat-option>
                <!-- Equipment options would be populated from service -->
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Block Thermometer</mat-label>
              <mat-select formControlName="blockThermometerId">
                <mat-option value="">Select Block Thermometer</mat-option>
                <!-- Equipment options would be populated from service -->
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Dropping Point Temperature (°C)</mat-label>
              <input matInput 
                     type="number" 
                     step="0.1"
                     formControlName="droppingPointTemperature"
                     (blur)="calculateResult()"
                     placeholder="Enter dropping point temperature">
              <mat-error *ngIf="droppingPointForm.get('droppingPointTemperature')?.hasError('required')">
                Dropping point temperature is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Block Temperature (°C)</mat-label>
              <input matInput 
                     type="number" 
                     step="0.1"
                     formControlName="blockTemperature"
                     (blur)="calculateResult()"
                     placeholder="Enter block temperature">
              <mat-error *ngIf="droppingPointForm.get('blockTemperature')?.hasError('required')">
                Block temperature is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Result (°C)</mat-label>
              <input matInput 
                     type="number" 
                     step="0.1"
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
                [disabled]="!droppingPointForm.valid || !droppingPointForm.get('isSelected')?.value"
                [loading]="isLoading()">
          <mat-icon>save</mat-icon>
          Save Dropping Point Test
        </button>
        
        <button mat-button 
                (click)="onClear()"
                [disabled]="isLoading()">
          <mat-icon>clear</mat-icon>
          Clear
        </button>
        
        <button mat-button 
                (click)="onPartialSave()"
                [disabled]="!droppingPointForm.get('isSelected')?.value || isLoading()">
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
export class DroppingPointEntryComponent {
    private fb = inject(FormBuilder);
    private testResultService = inject(TestResultService);
    private snackBar = inject(MatSnackBar);

    // Inputs
    sampleId = input.required<number>();
    testId = input.required<number>();
    trialNumber = input.required<number>();
    existingData = input<DroppingPointTestDto | null>(null);

    // Outputs
    saved = output<DroppingPointTestDto>();
    cleared = output<void>();

    // Signals
    isLoading = signal(false);

    // Form
    droppingPointForm: FormGroup;

    constructor() {
        this.droppingPointForm = this.fb.group({
            droppingPointThermometerId: [''],
            blockThermometerId: [''],
            droppingPointTemperature: [0, [Validators.required, Validators.min(0)]],
            blockTemperature: [0, [Validators.required, Validators.min(0)]],
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
            this.droppingPointForm.patchValue({
                droppingPointThermometerId: data.droppingPointThermometerId,
                blockThermometerId: data.blockThermometerId,
                droppingPointTemperature: data.droppingPointTemperature,
                blockTemperature: data.blockTemperature,
                result: data.result,
                comments: data.comments,
                isSelected: true
            });
        }
    }

    calculateResult(): void {
        const droppingPoint = this.droppingPointForm.get('droppingPointTemperature')?.value;
        const blockTemp = this.droppingPointForm.get('blockTemperature')?.value;

        if (droppingPoint && blockTemp) {
            // Dropping point calculation: droppingPoint + ((blockTemp - droppingPoint) / 3)
            const result = droppingPoint + ((blockTemp - droppingPoint) / 3);
            const roundedResult = Math.round(result);

            this.droppingPointForm.patchValue({ result: roundedResult });
        }
    }

    onSubmit(): void {
        if (this.droppingPointForm.valid && this.droppingPointForm.get('isSelected')?.value) {
            this.saveTestResult('S'); // Saved status
        }
    }

    onPartialSave(): void {
        if (this.droppingPointForm.get('isSelected')?.value) {
            this.saveTestResult('A'); // Accepted status for partial save
        }
    }

    onClear(): void {
        this.droppingPointForm.reset({
            droppingPointThermometerId: '',
            blockThermometerId: '',
            droppingPointTemperature: 0,
            blockTemperature: 0,
            result: 0,
            comments: '',
            isSelected: true
        });
        this.cleared.emit();
    }

    private saveTestResult(status: string): void {
        if (!this.droppingPointForm.valid) return;

        const formValue = this.droppingPointForm.value;

        const droppingPointTestDto: DroppingPointTestDto = {
            sampleId: this.sampleId(),
            testId: this.testId(),
            trialNumber: this.trialNumber(),
            droppingPointThermometerId: formValue.droppingPointThermometerId,
            blockThermometerId: formValue.blockThermometerId,
            droppingPointTemperature: formValue.droppingPointTemperature,
            blockTemperature: formValue.blockTemperature,
            result: formValue.result,
            status: status,
            comments: formValue.comments,
            entryId: 'CURRENT_USER', // This would come from authentication
            entryDate: new Date()
        };

        this.isLoading.set(true);

        this.testResultService.saveDroppingPointTest(droppingPointTestDto).subscribe({
            next: (result) => {
                this.isLoading.set(false);
                this.saved.emit(result);
                this.snackBar.open('Dropping Point test saved successfully', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            },
            error: (error) => {
                this.isLoading.set(false);
                this.snackBar.open('Error saving Dropping Point test: ' + error.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            }
        });
    }
}
