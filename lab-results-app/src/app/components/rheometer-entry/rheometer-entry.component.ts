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
import { RheometerTestDto } from '../../models/test-result.models';

@Component({
    selector: 'app-rheometer-entry',
    template: `
    <mat-card class="test-entry-card">
      <mat-card-header>
        <mat-card-title>Rheometer Test Entry</mat-card-title>
        <mat-card-subtitle>{{ getTestTitle() }}</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="rheometerForm" (ngSubmit)="onSubmit()">
          <div class="form-row" *ngIf="testId() === 284">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>D-inch</mat-label>
              <input matInput 
                     type="number" 
                     step="0.001"
                     formControlName="dInch"
                     placeholder="Enter D-inch value">
              <mat-error *ngIf="rheometerForm.get('dInch')?.hasError('required')">
                D-inch value is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row" *ngIf="testId() === 285">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Oil Content (%)</mat-label>
              <input matInput 
                     type="number" 
                     step="0.01"
                     formControlName="oilContent"
                     placeholder="Enter oil content percentage">
              <mat-error *ngIf="rheometerForm.get('oilContent')?.hasError('required')">
                Oil content is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row" *ngIf="testId() === 286">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Varnish Potential Rating</mat-label>
              <input matInput 
                     type="number" 
                     step="0.1"
                     formControlName="varnishPotentialRating"
                     placeholder="Enter varnish potential rating">
              <mat-error *ngIf="rheometerForm.get('varnishPotentialRating')?.hasError('required')">
                Varnish potential rating is required
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
                [disabled]="!rheometerForm.valid || !rheometerForm.get('isSelected')?.value"
                [loading]="isLoading()">
          <mat-icon>save</mat-icon>
          Save Rheometer Test
        </button>
        
        <button mat-button 
                (click)="onClear()"
                [disabled]="isLoading()">
          <mat-icon>clear</mat-icon>
          Clear
        </button>
        
        <button mat-button 
                (click)="onPartialSave()"
                [disabled]="!rheometerForm.get('isSelected')?.value || isLoading()">
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
export class RheometerEntryComponent {
    private fb = inject(FormBuilder);
    private testResultService = inject(TestResultService);
    private snackBar = inject(MatSnackBar);

    // Inputs
    sampleId = input.required<number>();
    testId = input.required<number>();
    trialNumber = input.required<number>();
    existingData = input<RheometerTestDto | null>(null);

    // Outputs
    saved = output<RheometerTestDto>();
    cleared = output<void>();

    // Signals
    isLoading = signal(false);

    // Form
    rheometerForm: FormGroup;

    constructor() {
        this.rheometerForm = this.fb.group({
            dInch: [null],
            oilContent: [null],
            varnishPotentialRating: [null],
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
            this.rheometerForm.patchValue({
                dInch: data.dInch,
                oilContent: data.oilContent,
                varnishPotentialRating: data.varnishPotentialRating,
                comments: data.comments,
                isSelected: true
            });
        }
    }

    getTestTitle(): string {
        switch (this.testId()) {
            case 284:
                return 'D-inch Test';
            case 285:
                return 'Oil Content Test';
            case 286:
                return 'Varnish Potential Rating Test';
            default:
                return 'Rheometer Test';
        }
    }

    onSubmit(): void {
        if (this.rheometerForm.valid && this.rheometerForm.get('isSelected')?.value) {
            this.saveTestResult('S'); // Saved status
        }
    }

    onPartialSave(): void {
        if (this.rheometerForm.get('isSelected')?.value) {
            this.saveTestResult('A'); // Accepted status for partial save
        }
    }

    onClear(): void {
        this.rheometerForm.reset({
            dInch: null,
            oilContent: null,
            varnishPotentialRating: null,
            comments: '',
            isSelected: true
        });
        this.cleared.emit();
    }

    private saveTestResult(status: string): void {
        if (!this.rheometerForm.valid) return;

        const formValue = this.rheometerForm.value;

        const rheometerTestDto: RheometerTestDto = {
            sampleId: this.sampleId(),
            testId: this.testId(),
            trialNumber: this.trialNumber(),
            dInch: formValue.dInch,
            oilContent: formValue.oilContent,
            varnishPotentialRating: formValue.varnishPotentialRating,
            status: status,
            comments: formValue.comments,
            entryId: 'CURRENT_USER', // This would come from authentication
            entryDate: new Date()
        };

        this.isLoading.set(true);

        this.testResultService.saveRheometerTest(rheometerTestDto).subscribe({
            next: (result) => {
                this.isLoading.set(false);
                this.saved.emit(result);
                this.snackBar.open('Rheometer test saved successfully', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            },
            error: (error) => {
                this.isLoading.set(false);
                this.snackBar.open('Error saving Rheometer test: ' + error.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            }
        });
    }
}
