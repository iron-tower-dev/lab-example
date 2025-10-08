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
import { ParticleCountTestDto } from '../../models/test-result.models';

interface ParticleSizeRange {
    name: string;
    key: keyof ParticleCountTestDto;
    range: string;
    description: string;
}

@Component({
    selector: 'app-particle-count-entry',
    template: `
    <mat-card class="test-entry-card">
      <mat-card-header>
        <mat-card-title>Particle Count Test Entry</mat-card-title>
        <mat-card-subtitle>Particle Size Distribution Analysis</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="particleCountForm" (ngSubmit)="onSubmit()">
          <!-- Particle Size Ranges -->
          <div class="particle-ranges-grid">
            <div class="range-group" *ngFor="let range of particleSizeRanges">
              <mat-form-field appearance="outline" class="range-field">
                <mat-label>{{ range.name }} ({{ range.range }})</mat-label>
                <input matInput 
                       type="number" 
                       step="1"
                       [formControlName]="range.key"
                       [placeholder]="'Enter count for ' + range.range">
                <mat-hint>{{ range.description }}</mat-hint>
              </mat-form-field>
            </div>
          </div>

          <!-- Classification Results -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>ISO Code</mat-label>
              <input matInput 
                     formControlName="isoCode"
                     placeholder="e.g., 18/15/12">
              <mat-hint>ISO 4406 classification</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>NAS Class</mat-label>
              <input matInput 
                     formControlName="nasClass"
                     placeholder="e.g., 7">
              <mat-hint>NAS 1638 classification</mat-hint>
            </mat-form-field>
          </div>

          <!-- Additional Options -->
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
                [disabled]="!particleCountForm.valid || !particleCountForm.get('isSelected')?.value"
                [loading]="isLoading()">
          <mat-icon>save</mat-icon>
          Save Particle Count Test
        </button>
        
        <button mat-button 
                (click)="onClear()"
                [disabled]="isLoading()">
          <mat-icon>clear</mat-icon>
          Clear
        </button>
        
        <button mat-button 
                (click)="onPartialSave()"
                [disabled]="!particleCountForm.get('isSelected')?.value || isLoading()">
          <mat-icon>save_alt</mat-icon>
          Partial Save
        </button>
      </mat-card-actions>
    </mat-card>
  `,
    styles: [`
    .test-entry-card {
      max-width: 1000px;
      margin: 20px auto;
    }
    
    .particle-ranges-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .range-group {
      display: flex;
      flex-direction: column;
    }
    
    .range-field {
      width: 100%;
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
export class ParticleCountEntryComponent {
    private fb = inject(FormBuilder);
    private testResultService = inject(TestResultService);
    private snackBar = inject(MatSnackBar);

    // Inputs
    sampleId = input.required<number>();
    testId = input.required<number>();
    trialNumber = input.required<number>();
    existingData = input<ParticleCountTestDto | null>(null);

    // Outputs
    saved = output<ParticleCountTestDto>();
    cleared = output<void>();

    // Signals
    isLoading = signal(false);

    // Form
    particleCountForm: FormGroup;

    // Particle Size Ranges
    particleSizeRanges: ParticleSizeRange[] = [
        {
            name: '5-10 Microns',
            key: 'micron5_10',
            range: '5-10 μm',
            description: 'Small particles'
        },
        {
            name: '10-15 Microns',
            key: 'micron10_15',
            range: '10-15 μm',
            description: 'Medium-small particles'
        },
        {
            name: '15-25 Microns',
            key: 'micron15_25',
            range: '15-25 μm',
            description: 'Medium particles'
        },
        {
            name: '25-50 Microns',
            key: 'micron25_50',
            range: '25-50 μm',
            description: 'Medium-large particles'
        },
        {
            name: '50-100 Microns',
            key: 'micron50_100',
            range: '50-100 μm',
            description: 'Large particles'
        },
        {
            name: '>100 Microns',
            key: 'micron100',
            range: '>100 μm',
            description: 'Very large particles'
        }
    ];

    constructor() {
        this.particleCountForm = this.fb.group({
            micron5_10: [null],
            micron10_15: [null],
            micron15_25: [null],
            micron25_50: [null],
            micron50_100: [null],
            micron100: [null],
            isoCode: [''],
            nasClass: [''],
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
            this.particleCountForm.patchValue({
                micron5_10: data.micron5_10,
                micron10_15: data.micron10_15,
                micron15_25: data.micron15_25,
                micron25_50: data.micron25_50,
                micron50_100: data.micron50_100,
                micron100: data.micron100,
                isoCode: data.isoCode,
                nasClass: data.nasClass,
                comments: data.comments,
                isSelected: true
            });
        }
    }

    onSubmit(): void {
        if (this.particleCountForm.valid && this.particleCountForm.get('isSelected')?.value) {
            this.saveTestResult('S'); // Saved status
        }
    }

    onPartialSave(): void {
        if (this.particleCountForm.get('isSelected')?.value) {
            this.saveTestResult('A'); // Accepted status for partial save
        }
    }

    onClear(): void {
        this.particleCountForm.reset({
            micron5_10: null,
            micron10_15: null,
            micron15_25: null,
            micron25_50: null,
            micron50_100: null,
            micron100: null,
            isoCode: '',
            nasClass: '',
            comments: '',
            isSelected: true
        });
        this.cleared.emit();
    }

    private saveTestResult(status: string): void {
        if (!this.particleCountForm.valid) return;

        const formValue = this.particleCountForm.value;

        const particleCountTestDto: ParticleCountTestDto = {
            sampleId: this.sampleId(),
            testId: this.testId(),
            trialNumber: this.trialNumber(),
            micron5_10: formValue.micron5_10,
            micron10_15: formValue.micron10_15,
            micron15_25: formValue.micron15_25,
            micron25_50: formValue.micron25_50,
            micron50_100: formValue.micron50_100,
            micron100: formValue.micron100,
            isoCode: formValue.isoCode,
            nasClass: formValue.nasClass,
            testDate: new Date(),
            status: status,
            comments: formValue.comments,
            entryId: 'CURRENT_USER', // This would come from authentication
            entryDate: new Date()
        };

        this.isLoading.set(true);

        this.testResultService.saveParticleCountTest(particleCountTestDto).subscribe({
            next: (result) => {
                this.isLoading.set(false);
                this.saved.emit(result);
                this.snackBar.open('Particle Count test saved successfully', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            },
            error: (error) => {
                this.isLoading.set(false);
                this.snackBar.open('Error saving Particle Count test: ' + error.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            }
        });
    }
}
