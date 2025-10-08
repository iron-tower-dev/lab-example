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
import { TanTestDto } from '../../models/test-result.models';

@Component({
  selector: 'app-tan-entry',
  template: `
    <mat-card class="test-entry-card">
      <mat-card-header>
        <mat-card-title>TAN Test Entry</mat-card-title>
        <mat-card-subtitle>Total Acid Number Test</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="tanForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Sample Weight (g)</mat-label>
              <input matInput 
                     type="number" 
                     step="0.001"
                     formControlName="sampleWeight"
                     (blur)="calculateTan()"
                     placeholder="Enter sample weight">
              <mat-error *ngIf="tanForm.get('sampleWeight')?.hasError('required')">
                Sample weight is required
              </mat-error>
              <mat-error *ngIf="tanForm.get('sampleWeight')?.hasError('min')">
                Sample weight must be greater than 0
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Final Buret Reading (ml)</mat-label>
              <input matInput 
                     type="number" 
                     step="0.01"
                     formControlName="finalBuret"
                     (blur)="calculateTan()"
                     placeholder="Enter final buret reading">
              <mat-error *ngIf="tanForm.get('finalBuret')?.hasError('required')">
                Final buret reading is required
              </mat-error>
              <mat-error *ngIf="tanForm.get('finalBuret')?.hasError('min')">
                Final buret reading must be greater than 0
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>TAN Result (mg KOH/g)</mat-label>
              <input matInput 
                     type="number" 
                     step="0.01"
                     formControlName="tanResult"
                     readonly
                     placeholder="Calculated TAN result">
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Equipment ID</mat-label>
              <input matInput 
                     formControlName="equipmentId"
                     placeholder="Enter equipment ID">
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
                [disabled]="!tanForm.valid || !tanForm.get('isSelected')?.value"
                [loading]="isLoading()">
          <mat-icon>save</mat-icon>
          Save TAN Test
        </button>
        
        <button mat-button 
                (click)="onClear()"
                [disabled]="isLoading()">
          <mat-icon>clear</mat-icon>
          Clear
        </button>
        
        <button mat-button 
                (click)="onPartialSave()"
                [disabled]="!tanForm.get('isSelected')?.value || isLoading()">
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
export class TanEntryComponent {
  private fb = inject(FormBuilder);
  private testResultService = inject(TestResultService);
  private snackBar = inject(MatSnackBar);

  // Inputs
  sampleId = input.required<number>();
  testId = input.required<number>();
  trialNumber = input.required<number>();
  existingData = input<TanTestDto | null>(null);

  // Outputs
  saved = output<TanTestDto>();
  cleared = output<void>();

  // Signals
  isLoading = signal(false);

  // Form
  tanForm: FormGroup;

  constructor() {
    this.tanForm = this.fb.group({
      sampleWeight: [0, [Validators.required, Validators.min(0.001)]],
      finalBuret: [0, [Validators.required, Validators.min(0.01)]],
      tanResult: [0, Validators.required],
      equipmentId: [''],
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
      this.tanForm.patchValue({
        sampleWeight: data.sampleWeight,
        finalBuret: data.finalBuret,
        tanResult: data.tanCalculated,
        equipmentId: data.equipmentId,
        comments: data.comments,
        isSelected: true
      });
    }
  }

  calculateTan(): void {
    const sampleWeight = this.tanForm.get('sampleWeight')?.value;
    const finalBuret = this.tanForm.get('finalBuret')?.value;

    if (sampleWeight && finalBuret && sampleWeight > 0) {
      // TAN calculation: ((FinalBuret * 5.61) / SampleWeight) * 100
      const tanResult = ((finalBuret * 5.61) / sampleWeight) * 100;
      const roundedResult = Math.round(tanResult * 100) / 100;
      const finalResult = roundedResult < 0.01 ? 0.01 : roundedResult;

      this.tanForm.patchValue({ tanResult: finalResult });
    }
  }

  onSubmit(): void {
    if (this.tanForm.valid && this.tanForm.get('isSelected')?.value) {
      this.saveTestResult('S'); // Saved status
    }
  }

  onPartialSave(): void {
    if (this.tanForm.get('isSelected')?.value) {
      this.saveTestResult('A'); // Accepted status for partial save
    }
  }

  onClear(): void {
    this.tanForm.reset({
      sampleWeight: 0,
      finalBuret: 0,
      tanResult: 0,
      equipmentId: '',
      comments: '',
      isSelected: true
    });
    this.cleared.emit();
  }

  private saveTestResult(status: string): void {
    if (!this.tanForm.valid) return;

    const formValue = this.tanForm.value;

    const tanTestDto: TanTestDto = {
      sampleId: this.sampleId(),
      testId: this.testId(),
      trialNumber: this.trialNumber(),
      sampleWeight: formValue.sampleWeight,
      finalBuret: formValue.finalBuret,
      tanCalculated: formValue.tanResult,
      equipmentId: formValue.equipmentId,
      status: status,
      comments: formValue.comments,
      entryId: 'CURRENT_USER', // This would come from authentication
      entryDate: new Date()
    };

    this.isLoading.set(true);

    this.testResultService.saveTanTest(tanTestDto).subscribe({
      next: (result) => {
        this.isLoading.set(false);
        this.saved.emit(result);
        this.snackBar.open('TAN test saved successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        this.isLoading.set(false);
        this.snackBar.open('Error saving TAN test: ' + error.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }
}