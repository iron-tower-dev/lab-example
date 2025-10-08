import { Component, input, output, signal, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { TestResultService } from '../../services/test-result.service';
import { EmissionSpectroDto } from '../../models/test-result.models';

interface ElementData {
    name: string;
    symbol: string;
    value: number | null;
    unit: string;
}

@Component({
    selector: 'app-emission-spectro-entry',
    template: `
    <mat-card class="test-entry-card">
      <mat-card-header>
        <mat-card-title>Emission Spectrometry Test Entry</mat-card-title>
        <mat-card-subtitle>Elemental Analysis Test</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="emissionForm" (ngSubmit)="onSubmit()">
          <!-- Element Analysis Table -->
          <div class="element-table-container">
            <table mat-table [dataSource]="elementData" class="element-table">
              <!-- Element Name Column -->
              <ng-container matColumnDef="element">
                <th mat-header-cell *matHeaderCellDef>Element</th>
                <td mat-cell *matCellDef="let element">{{ element.name }}</td>
              </ng-container>

              <!-- Symbol Column -->
              <ng-container matColumnDef="symbol">
                <th mat-header-cell *matHeaderCellDef>Symbol</th>
                <td mat-cell *matCellDef="let element">{{ element.symbol }}</td>
              </ng-container>

              <!-- Value Column -->
              <ng-container matColumnDef="value">
                <th mat-header-cell *matHeaderCellDef>Concentration ({{ elementData[0]?.unit }})</th>
                <td mat-cell *matCellDef="let element; let i = index">
                  <mat-form-field appearance="outline" class="value-field">
                    <input matInput 
                           type="number" 
                           step="0.001"
                           [formControlName]="'element_' + i"
                           placeholder="0.000">
                  </mat-form-field>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <!-- Additional Options -->
          <div class="form-row">
            <mat-checkbox formControlName="scheduleNextTest" class="schedule-checkbox">
              Schedule next test in sequence
            </mat-checkbox>
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
                [disabled]="!emissionForm.valid || !emissionForm.get('isSelected')?.value"
                [loading]="isLoading()">
          <mat-icon>save</mat-icon>
          Save Emission Spectro Test
        </button>
        
        <button mat-button 
                (click)="onClear()"
                [disabled]="isLoading()">
          <mat-icon>clear</mat-icon>
          Clear
        </button>
        
        <button mat-button 
                (click)="onPartialSave()"
                [disabled]="!emissionForm.get('isSelected')?.value || isLoading()">
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
    
    .element-table-container {
      overflow-x: auto;
      margin-bottom: 20px;
    }
    
    .element-table {
      width: 100%;
      min-width: 600px;
    }
    
    .value-field {
      width: 120px;
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
    
    .schedule-checkbox,
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
        MatTableModule
    ]
})
export class EmissionSpectroEntryComponent {
    private fb = inject(FormBuilder);
    private testResultService = inject(TestResultService);
    private snackBar = inject(MatSnackBar);

    // Inputs
    sampleId = input.required<number>();
    testId = input.required<number>();
    trialNumber = input.required<number>();
    existingData = input<EmissionSpectroDto | null>(null);

    // Outputs
    saved = output<EmissionSpectroDto>();
    cleared = output<void>();

    // Signals
    isLoading = signal(false);

    // Form
    emissionForm: FormGroup;

    // Element data
    elementData: ElementData[] = [
        { name: 'Sodium', symbol: 'Na', value: null, unit: 'ppm' },
        { name: 'Molybdenum', symbol: 'Mo', value: null, unit: 'ppm' },
        { name: 'Magnesium', symbol: 'Mg', value: null, unit: 'ppm' },
        { name: 'Phosphorus', symbol: 'P', value: null, unit: 'ppm' },
        { name: 'Boron', symbol: 'B', value: null, unit: 'ppm' },
        { name: 'Hydrogen', symbol: 'H', value: null, unit: 'ppm' },
        { name: 'Chromium', symbol: 'Cr', value: null, unit: 'ppm' },
        { name: 'Calcium', symbol: 'Ca', value: null, unit: 'ppm' },
        { name: 'Nickel', symbol: 'Ni', value: null, unit: 'ppm' },
        { name: 'Silver', symbol: 'Ag', value: null, unit: 'ppm' },
        { name: 'Copper', symbol: 'Cu', value: null, unit: 'ppm' },
        { name: 'Tin', symbol: 'Sn', value: null, unit: 'ppm' },
        { name: 'Aluminum', symbol: 'Al', value: null, unit: 'ppm' },
        { name: 'Manganese', symbol: 'Mn', value: null, unit: 'ppm' },
        { name: 'Lead', symbol: 'Pb', value: null, unit: 'ppm' },
        { name: 'Iron', symbol: 'Fe', value: null, unit: 'ppm' },
        { name: 'Silicon', symbol: 'Si', value: null, unit: 'ppm' },
        { name: 'Barium', symbol: 'Ba', value: null, unit: 'ppm' },
        { name: 'Antimony', symbol: 'Sb', value: null, unit: 'ppm' },
        { name: 'Zinc', symbol: 'Zn', value: null, unit: 'ppm' }
    ];

    displayedColumns: string[] = ['element', 'symbol', 'value'];

    constructor() {
        this.emissionForm = this.fb.group({
            comments: [''],
            scheduleNextTest: [false],
            isSelected: [true]
        });

        // Add form controls for each element
        this.elementData.forEach((_, index) => {
            this.emissionForm.addControl(`element_${index}`, this.fb.control(null));
        });

        // Load existing data if provided
        if (this.existingData()) {
            this.loadExistingData();
        }
    }

    private loadExistingData(): void {
        const data = this.existingData();
        if (data) {
            // Map element data to form controls
            const elementValues = [
                data.Na, data.Mo, data.Mg, data.P, data.B, data.H,
                data.Cr, data.Ca, data.Ni, data.Ag, data.Cu, data.Sn,
                data.Al, data.Mn, data.Pb, data.Fe, data.Si, data.Ba,
                data.Sb, data.Zn
            ];

            elementValues.forEach((value, index) => {
                this.emissionForm.get(`element_${index}`)?.setValue(value);
            });

            this.emissionForm.patchValue({
                comments: data.comments,
                scheduleNextTest: data.scheduleNextTest,
                isSelected: true
            });
        }
    }

    onSubmit(): void {
        if (this.emissionForm.valid && this.emissionForm.get('isSelected')?.value) {
            this.saveTestResult('S'); // Saved status
        }
    }

    onPartialSave(): void {
        if (this.emissionForm.get('isSelected')?.value) {
            this.saveTestResult('A'); // Accepted status for partial save
        }
    }

    onClear(): void {
        this.emissionForm.reset({
            comments: '',
            scheduleNextTest: false,
            isSelected: true
        });

        // Clear all element values
        this.elementData.forEach((_, index) => {
            this.emissionForm.get(`element_${index}`)?.setValue(null);
        });

        this.cleared.emit();
    }

    private saveTestResult(status: string): void {
        if (!this.emissionForm.valid) return;

        const formValue = this.emissionForm.value;

        const emissionSpectroDto: EmissionSpectroDto = {
            sampleId: this.sampleId(),
            testId: this.testId(),
            trialNumber: this.trialNumber(),
            Na: formValue.element_0,
            Mo: formValue.element_1,
            Mg: formValue.element_2,
            P: formValue.element_3,
            B: formValue.element_4,
            H: formValue.element_5,
            Cr: formValue.element_6,
            Ca: formValue.element_7,
            Ni: formValue.element_8,
            Ag: formValue.element_9,
            Cu: formValue.element_10,
            Sn: formValue.element_11,
            Al: formValue.element_12,
            Mn: formValue.element_13,
            Pb: formValue.element_14,
            Fe: formValue.element_15,
            Si: formValue.element_16,
            Ba: formValue.element_17,
            Sb: formValue.element_18,
            Zn: formValue.element_19,
            trialDate: new Date(),
            status: status,
            comments: formValue.comments,
            entryId: 'CURRENT_USER', // This would come from authentication
            entryDate: new Date(),
            scheduleNextTest: formValue.scheduleNextTest
        };

        this.isLoading.set(true);

        this.testResultService.saveEmissionSpectroTest(emissionSpectroDto).subscribe({
            next: (result) => {
                this.isLoading.set(false);
                this.saved.emit(result);
                this.snackBar.open('Emission Spectrometry test saved successfully', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            },
            error: (error) => {
                this.isLoading.set(false);
                this.snackBar.open('Error saving Emission Spectrometry test: ' + error.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            }
        });
    }
}
