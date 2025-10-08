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
import { FtirTestDto } from '../../models/test-result.models';

interface FtirParameter {
    name: string;
    key: keyof FtirTestDto;
    unit: string;
    description: string;
}

@Component({
    selector: 'app-ftir-entry',
    template: `
    <mat-card class="test-entry-card">
      <mat-card-header>
        <mat-card-title>FTIR Test Entry</mat-card-title>
        <mat-card-subtitle>Fourier Transform Infrared Spectroscopy</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="ftirForm" (ngSubmit)="onSubmit()">
          <!-- FTIR Parameters Grid -->
          <div class="parameters-grid">
            <div class="parameter-group" *ngFor="let param of ftirParameters">
              <mat-form-field appearance="outline" class="parameter-field">
                <mat-label>{{ param.name }} ({{ param.unit }})</mat-label>
                <input matInput 
                       type="number" 
                       step="0.001"
                       [formControlName]="param.key"
                       [placeholder]="'Enter ' + param.name.toLowerCase()">
                <mat-hint>{{ param.description }}</mat-hint>
              </mat-form-field>
            </div>
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
                [disabled]="!ftirForm.valid || !ftirForm.get('isSelected')?.value"
                [loading]="isLoading()">
          <mat-icon>save</mat-icon>
          Save FTIR Test
        </button>
        
        <button mat-button 
                (click)="onClear()"
                [disabled]="isLoading()">
          <mat-icon>clear</mat-icon>
          Clear
        </button>
        
        <button mat-button 
                (click)="onPartialSave()"
                [disabled]="!ftirForm.get('isSelected')?.value || isLoading()">
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
    
    .parameters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .parameter-group {
      display: flex;
      flex-direction: column;
    }
    
    .parameter-field {
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
export class FtirEntryComponent {
    private fb = inject(FormBuilder);
    private testResultService = inject(TestResultService);
    private snackBar = inject(MatSnackBar);

    // Inputs
    sampleId = input.required<number>();
    testId = input.required<number>();
    trialNumber = input.required<number>();
    existingData = input<FtirTestDto | null>(null);

    // Outputs
    saved = output<FtirTestDto>();
    cleared = output<void>();

    // Signals
    isLoading = signal(false);

    // Form
    ftirForm: FormGroup;

    // FTIR Parameters
    ftirParameters: FtirParameter[] = [
        {
            name: 'Delta Area',
            key: 'deltaArea',
            unit: 'cm⁻¹',
            description: 'Contamination level'
        },
        {
            name: 'Anti-oxidant',
            key: 'antiOxidant',
            unit: 'cm⁻¹',
            description: 'Anti-oxidant additive level'
        },
        {
            name: 'Oxidation',
            key: 'oxidation',
            unit: 'cm⁻¹',
            description: 'Oxidation level'
        },
        {
            name: 'H2O',
            key: 'h2o',
            unit: 'cm⁻¹',
            description: 'Water content'
        },
        {
            name: 'Anti-wear',
            key: 'antiWear',
            unit: 'cm⁻¹',
            description: 'Anti-wear additive level'
        },
        {
            name: 'Soot',
            key: 'soot',
            unit: 'cm⁻¹',
            description: 'Soot contamination level'
        },
        {
            name: 'Fuel Dilution',
            key: 'fuelDilution',
            unit: 'cm⁻¹',
            description: 'Fuel dilution level'
        },
        {
            name: 'Mixture',
            key: 'mixture',
            unit: 'cm⁻¹',
            description: 'Mixture contamination'
        },
        {
            name: 'Weak Acid',
            key: 'weakAcid',
            unit: 'cm⁻¹',
            description: 'Weak acid level'
        }
    ];

    constructor() {
        this.ftirForm = this.fb.group({
            deltaArea: [null],
            antiOxidant: [null],
            oxidation: [null],
            h2o: [null],
            antiWear: [null],
            soot: [null],
            fuelDilution: [null],
            mixture: [null],
            weakAcid: [null],
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
            this.ftirForm.patchValue({
                deltaArea: data.deltaArea,
                antiOxidant: data.antiOxidant,
                oxidation: data.oxidation,
                h2o: data.h2o,
                antiWear: data.antiWear,
                soot: data.soot,
                fuelDilution: data.fuelDilution,
                mixture: data.mixture,
                weakAcid: data.weakAcid,
                comments: data.comments,
                isSelected: true
            });
        }
    }

    onSubmit(): void {
        if (this.ftirForm.valid && this.ftirForm.get('isSelected')?.value) {
            this.saveTestResult('S'); // Saved status
        }
    }

    onPartialSave(): void {
        if (this.ftirForm.get('isSelected')?.value) {
            this.saveTestResult('A'); // Accepted status for partial save
        }
    }

    onClear(): void {
        this.ftirForm.reset({
            deltaArea: null,
            antiOxidant: null,
            oxidation: null,
            h2o: null,
            antiWear: null,
            soot: null,
            fuelDilution: null,
            mixture: null,
            weakAcid: null,
            comments: '',
            isSelected: true
        });
        this.cleared.emit();
    }

    private saveTestResult(status: string): void {
        if (!this.ftirForm.valid) return;

        const formValue = this.ftirForm.value;

        const ftirTestDto: FtirTestDto = {
            sampleId: this.sampleId(),
            testId: this.testId(),
            trialNumber: this.trialNumber(),
            deltaArea: formValue.deltaArea,
            antiOxidant: formValue.antiOxidant,
            oxidation: formValue.oxidation,
            h2o: formValue.h2o,
            antiWear: formValue.antiWear,
            soot: formValue.soot,
            fuelDilution: formValue.fuelDilution,
            mixture: formValue.mixture,
            weakAcid: formValue.weakAcid,
            status: status,
            comments: formValue.comments,
            entryId: 'CURRENT_USER', // This would come from authentication
            entryDate: new Date()
        };

        this.isLoading.set(true);

        this.testResultService.saveFtirTest(ftirTestDto).subscribe({
            next: (result) => {
                this.isLoading.set(false);
                this.saved.emit(result);
                this.snackBar.open('FTIR test saved successfully', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            },
            error: (error) => {
                this.isLoading.set(false);
                this.snackBar.open('Error saving FTIR test: ' + error.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            }
        });
    }
}
