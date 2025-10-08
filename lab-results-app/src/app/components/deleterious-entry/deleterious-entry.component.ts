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
import { DeleteriousTestDto } from '../../models/test-result.models';

@Component({
    selector: 'app-deleterious-entry',
    template: `
    <mat-card class="test-entry-card">
      <mat-card-header>
        <mat-card-title>Deleterious Test Entry</mat-card-title>
        <mat-card-subtitle>Deleterious Test</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="deleteriousForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Deleterious MTE#</mat-label>
              <mat-select formControlName="deleteriousMteId">
                <mat-option value="">Select Deleterious Equipment</mat-option>
                <!-- Equipment options would be populated from service -->
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Pressure</mat-label>
              <input matInput 
                     type="number" 
                     step="0.1"
                     formControlName="pressure"
                     placeholder="Enter pressure">
              <mat-error *ngIf="deleteriousForm.get('pressure')?.hasError('required')">
                Pressure is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Scratches</mat-label>
              <input matInput 
                     type="number" 
                     step="0.1"
                     formControlName="scratches"
                     placeholder="Enter scratches count">
              <mat-error *ngIf="deleteriousForm.get('scratches')?.hasError('required')">
                Scratches count is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Pass/Fail</mat-label>
              <mat-select formControlName="passFail">
                <mat-option value="">Select Result</mat-option>
                <mat-option value="pass">Pass</mat-option>
                <mat-option value="fail">Fail</mat-option>
              </mat-select>
              <mat-error *ngIf="deleteriousForm.get('passFail')?.hasError('required')">
                Pass/Fail result is required
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
                [disabled]="!deleteriousForm.valid || !deleteriousForm.get('isSelected')?.value"
                [loading]="isLoading()">
          <mat-icon>save</mat-icon>
          Save Deleterious Test
        </button>
        
        <button mat-button 
                (click)="onClear()"
                [disabled]="isLoading()">
          <mat-icon>clear</mat-icon>
          Clear
        </button>
        
        <button mat-button 
                (click)="onPartialSave()"
                [disabled]="!deleteriousForm.get('isSelected')?.value || isLoading()">
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
export class DeleteriousEntryComponent {
    private fb = inject(FormBuilder);
    private testResultService = inject(TestResultService);
    private snackBar = inject(MatSnackBar);

    // Inputs
    sampleId = input.required<number>();
    testId = input.required<number>();
    trialNumber = input.required<number>();
    existingData = input<DeleteriousTestDto | null>(null);

    // Outputs
    saved = output<DeleteriousTestDto>();
    cleared = output<void>();

    // Signals
    isLoading = signal(false);

    // Form
    deleteriousForm: FormGroup;

    constructor() {
        this.deleteriousForm = this.fb.group({
            deleteriousMteId: [''],
            pressure: [0, [Validators.required, Validators.min(0)]],
            scratches: [0, [Validators.required, Validators.min(0)]],
            passFail: ['', Validators.required],
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
            this.deleteriousForm.patchValue({
                deleteriousMteId: data.deleteriousMteId,
                pressure: data.pressure,
                scratches: data.scratches,
                passFail: data.passFail,
                comments: data.comments,
                isSelected: true
            });
        }
    }

    onSubmit(): void {
        if (this.deleteriousForm.valid && this.deleteriousForm.get('isSelected')?.value) {
            this.saveTestResult('S'); // Saved status
        }
    }

    onPartialSave(): void {
        if (this.deleteriousForm.get('isSelected')?.value) {
            this.saveTestResult('A'); // Accepted status for partial save
        }
    }

    onClear(): void {
        this.deleteriousForm.reset({
            deleteriousMteId: '',
            pressure: 0,
            scratches: 0,
            passFail: '',
            comments: '',
            isSelected: true
        });
        this.cleared.emit();
    }

    private saveTestResult(status: string): void {
        if (!this.deleteriousForm.valid) return;

        const formValue = this.deleteriousForm.value;

        const deleteriousTestDto: DeleteriousTestDto = {
            sampleId: this.sampleId(),
            testId: this.testId(),
            trialNumber: this.trialNumber(),
            deleteriousMteId: formValue.deleteriousMteId,
            pressure: formValue.pressure,
            scratches: formValue.scratches,
            passFail: formValue.passFail,
            status: status,
            comments: formValue.comments,
            entryId: 'CURRENT_USER', // This would come from authentication
            entryDate: new Date()
        };

        this.isLoading.set(true);

        this.testResultService.saveDeleteriousTest(deleteriousTestDto).subscribe({
            next: (result) => {
                this.isLoading.set(false);
                this.saved.emit(result);
                this.snackBar.open('Deleterious test saved successfully', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            },
            error: (error) => {
                this.isLoading.set(false);
                this.snackBar.open('Error saving Deleterious test: ' + error.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            }
        });
    }
}
