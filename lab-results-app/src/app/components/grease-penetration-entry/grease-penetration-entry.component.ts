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
import { GreasePenetrationTestDto } from '../../models/test-result.models';

@Component({
    selector: 'app-grease-penetration-entry',
    template: `
    <mat-card class="test-entry-card">
      <mat-card-header>
        <mat-card-title>Grease Penetration Worked Test Entry</mat-card-title>
        <mat-card-subtitle>Grease Penetration Test</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="greasePenetrationForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>1st Penetration</mat-label>
              <input matInput 
                     type="number" 
                     step="0.1"
                     formControlName="firstPenetration"
                     (blur)="calculateResult()"
                     placeholder="Enter first penetration">
              <mat-error *ngIf="greasePenetrationForm.get('firstPenetration')?.hasError('required')">
                First penetration is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>2nd Penetration</mat-label>
              <input matInput 
                     type="number" 
                     step="0.1"
                     formControlName="secondPenetration"
                     (blur)="calculateResult()"
                     placeholder="Enter second penetration">
              <mat-error *ngIf="greasePenetrationForm.get('secondPenetration')?.hasError('required')">
                Second penetration is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>3rd Penetration</mat-label>
              <input matInput 
                     type="number" 
                     step="0.1"
                     formControlName="thirdPenetration"
                     (blur)="calculateResult()"
                     placeholder="Enter third penetration">
              <mat-error *ngIf="greasePenetrationForm.get('thirdPenetration')?.hasError('required')">
                Third penetration is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Result</mat-label>
              <input matInput 
                     type="number" 
                     step="0.1"
                     formControlName="result"
                     readonly
                     placeholder="Calculated result">
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>NLGI</mat-label>
              <input matInput 
                     formControlName="nlgi"
                     placeholder="NLGI classification">
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
                [disabled]="!greasePenetrationForm.valid || !greasePenetrationForm.get('isSelected')?.value"
                [loading]="isLoading()">
          <mat-icon>save</mat-icon>
          Save Grease Penetration Test
        </button>
        
        <button mat-button 
                (click)="onClear()"
                [disabled]="isLoading()">
          <mat-icon>clear</mat-icon>
          Clear
        </button>
        
        <button mat-button 
                (click)="onPartialSave()"
                [disabled]="!greasePenetrationForm.get('isSelected')?.value || isLoading()">
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
export class GreasePenetrationEntryComponent {
    private fb = inject(FormBuilder);
    private testResultService = inject(TestResultService);
    private snackBar = inject(MatSnackBar);

    // Inputs
    sampleId = input.required<number>();
    testId = input.required<number>();
    trialNumber = input.required<number>();
    existingData = input<GreasePenetrationTestDto | null>(null);

    // Outputs
    saved = output<GreasePenetrationTestDto>();
    cleared = output<void>();

    // Signals
    isLoading = signal(false);

    // Form
    greasePenetrationForm: FormGroup;

    constructor() {
        this.greasePenetrationForm = this.fb.group({
            firstPenetration: [0, [Validators.required, Validators.min(0)]],
            secondPenetration: [0, [Validators.required, Validators.min(0)]],
            thirdPenetration: [0, [Validators.required, Validators.min(0)]],
            result: [0, Validators.required],
            nlgi: [''],
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
            this.greasePenetrationForm.patchValue({
                firstPenetration: data.firstPenetration,
                secondPenetration: data.secondPenetration,
                thirdPenetration: data.thirdPenetration,
                result: data.result,
                nlgi: data.nlgi,
                comments: data.comments,
                isSelected: true
            });
        }
    }

    calculateResult(): void {
        const cone1 = this.greasePenetrationForm.get('firstPenetration')?.value;
        const cone2 = this.greasePenetrationForm.get('secondPenetration')?.value;
        const cone3 = this.greasePenetrationForm.get('thirdPenetration')?.value;

        if (cone1 && cone2 && cone3) {
            // Grease penetration calculation: (average * 3.75) + 24
            const average = Math.round((cone1 + cone2 + cone3) / 3);
            const result = (average * 3.75) + 24;
            const roundedResult = Math.round(result);

            this.greasePenetrationForm.patchValue({ result: roundedResult });
        }
    }

    onSubmit(): void {
        if (this.greasePenetrationForm.valid && this.greasePenetrationForm.get('isSelected')?.value) {
            this.saveTestResult('S'); // Saved status
        }
    }

    onPartialSave(): void {
        if (this.greasePenetrationForm.get('isSelected')?.value) {
            this.saveTestResult('A'); // Accepted status for partial save
        }
    }

    onClear(): void {
        this.greasePenetrationForm.reset({
            firstPenetration: 0,
            secondPenetration: 0,
            thirdPenetration: 0,
            result: 0,
            nlgi: '',
            comments: '',
            isSelected: true
        });
        this.cleared.emit();
    }

    private saveTestResult(status: string): void {
        if (!this.greasePenetrationForm.valid) return;

        const formValue = this.greasePenetrationForm.value;

        const greasePenetrationTestDto: GreasePenetrationTestDto = {
            sampleId: this.sampleId(),
            testId: this.testId(),
            trialNumber: this.trialNumber(),
            firstPenetration: formValue.firstPenetration,
            secondPenetration: formValue.secondPenetration,
            thirdPenetration: formValue.thirdPenetration,
            result: formValue.result,
            nlgi: formValue.nlgi,
            status: status,
            comments: formValue.comments,
            entryId: 'CURRENT_USER', // This would come from authentication
            entryDate: new Date()
        };

        this.isLoading.set(true);

        this.testResultService.saveGreasePenetrationTest(greasePenetrationTestDto).subscribe({
            next: (result) => {
                this.isLoading.set(false);
                this.saved.emit(result);
                this.snackBar.open('Grease Penetration test saved successfully', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            },
            error: (error) => {
                this.isLoading.set(false);
                this.snackBar.open('Error saving Grease Penetration test: ' + error.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            }
        });
    }
}
