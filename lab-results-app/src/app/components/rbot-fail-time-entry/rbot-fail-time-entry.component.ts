import { Component, input, output, signal, inject, OnInit } from '@angular/core';
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
import { Equipment } from '../../models/test-result.models';

@Component({
    selector: 'app-rbot-fail-time-entry',
    template: `
    <mat-card class="test-entry-card">
      <mat-card-header>
        <mat-card-title>RBOT Fail Time Test Entry</mat-card-title>
        <mat-card-subtitle>Rotating Bomb Oxidation Test - Fail Time Measurement</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="rbotFailTimeForm" (ngSubmit)="onSubmit()">
          <!-- Equipment Selection -->
          <div class="form-section">
            <h3>Equipment Information</h3>
            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Thermometer MTE#</mat-label>
                <mat-select formControlName="thermometerMteId">
                  <mat-option value="">Select Thermometer</mat-option>
                  <mat-option *ngFor="let equipment of thermometerEquipment()" 
                              [value]="equipment.equipName"
                              [disabled]="equipment.isOverdue">
                    {{ equipment.equipName }} {{ equipment.suffix }}
                    <span *ngIf="equipment.isOverdue" class="overdue-warning">(Overdue)</span>
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="rbotFailTimeForm.get('thermometerMteId')?.hasError('required')">
                  Thermometer selection is required
                </mat-error>
              </mat-form-field>
            </div>
          </div>

          <!-- Test Results -->
          <div class="form-section">
            <h3>Test Results</h3>
            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Fail Time (minutes)</mat-label>
                <input matInput 
                       type="number" 
                       step="0.1"
                       formControlName="failTime"
                       placeholder="Enter fail time in minutes">
                <mat-error *ngIf="rbotFailTimeForm.get('failTime')?.hasError('required')">
                  Fail time is required
                </mat-error>
                <mat-error *ngIf="rbotFailTimeForm.get('failTime')?.hasError('min')">
                  Fail time must be greater than 0
                </mat-error>
              </mat-form-field>
            </div>
          </div>

          <!-- Comments -->
          <div class="form-section">
            <h3>Comments</h3>
            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>Test Comments</mat-label>
              <textarea matInput 
                        formControlName="comments"
                        rows="3"
                        placeholder="Enter any comments about the test">
              </textarea>
            </mat-form-field>
          </div>

          <!-- Save Selection -->
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
                [disabled]="!rbotFailTimeForm.valid || !rbotFailTimeForm.get('isSelected')?.value"
                [loading]="isLoading()">
          <mat-icon>save</mat-icon>
          Save RBOT Fail Time Test
        </button>
        
        <button mat-button 
                (click)="onClear()"
                [disabled]="isLoading()">
          <mat-icon>clear</mat-icon>
          Clear
        </button>
      </mat-card-actions>
    </mat-card>
  `,
    styles: [`
    .test-entry-card {
      max-width: 800px;
      margin: 20px auto;
    }
    
    .form-section {
      margin-bottom: 24px;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    
    .form-section h3 {
      margin-top: 0;
      color: #1976d2;
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
    
    .overdue-warning {
      color: #f44336;
      font-weight: bold;
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
export class RbotFailTimeEntryComponent implements OnInit {
    private fb = inject(FormBuilder);
    private testResultService = inject(TestResultService);
    private snackBar = inject(MatSnackBar);

    // Inputs
    sampleId = input.required<number>();
    testId = input.required<number>();
    trialNumber = input.required<number>();
    existingData = input<any | null>(null);

    // Outputs
    saved = output<any>();
    cleared = output<void>();

    // Signals
    isLoading = signal(false);
    thermometerEquipment = signal<Equipment[]>([]);

    // Form
    rbotFailTimeForm: FormGroup;

    constructor() {
        this.rbotFailTimeForm = this.fb.group({
            thermometerMteId: ['', Validators.required],
            failTime: [0, [Validators.required, Validators.min(0.1)]],
            comments: [''],
            isSelected: [true]
        });
    }

    ngOnInit(): void {
        this.loadEquipment();
        this.loadExistingData();
    }

    private loadEquipment(): void {
        // Load thermometer equipment for RBOT test (test ID 170)
        this.testResultService.getEquipment('THERMOMETER', 170).subscribe({
            next: (equipment) => {
                this.thermometerEquipment.set(equipment);
            },
            error: (error) => {
                console.error('Error loading thermometer equipment:', error);
                this.snackBar.open('Error loading equipment data', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            }
        });
    }

    private loadExistingData(): void {
        const existing = this.existingData();
        if (existing) {
            this.rbotFailTimeForm.patchValue({
                thermometerMteId: existing.id1 || '',
                failTime: existing.value1 || 0,
                comments: existing.mainComments || '',
                isSelected: true
            });
        }
    }

    onSubmit(): void {
        if (this.rbotFailTimeForm.valid && this.rbotFailTimeForm.get('isSelected')?.value) {
            this.saveTestResult();
        }
    }

    onClear(): void {
        this.rbotFailTimeForm.reset({
            thermometerMteId: '',
            failTime: 0,
            comments: '',
            isSelected: true
        });

        this.cleared.emit();
    }

    private saveTestResult(): void {
        if (!this.rbotFailTimeForm.valid) return;

        const formValue = this.rbotFailTimeForm.value;

        const testResultData = {
            sampleId: this.sampleId(),
            testId: this.testId(),
            trialNumber: this.trialNumber(),
            thermometerMteId: formValue.thermometerMteId,
            failTime: formValue.failTime,
            comments: formValue.comments,
            status: 'S',
            entryId: 'CURRENT_USER',
            entryDate: new Date()
        };

        this.isLoading.set(true);

        // Use the general test result save method
        this.testResultService.saveTestResults({
            sampleId: this.sampleId(),
            testId: this.testId(),
            mode: 'entry',
            entries: [{
                sampleId: this.sampleId(),
                testId: this.testId(),
                trialNumber: this.trialNumber(),
                value1: formValue.failTime,
                id1: formValue.thermometerMteId,
                status: 'S',
                mainComments: formValue.comments,
                isPartialSave: false,
                isMediaReady: false,
                isDelete: false
            }],
            isPartialSave: false,
            isMediaReady: false,
            isDelete: false
        }).subscribe({
            next: (result) => {
                this.isLoading.set(false);
                this.saved.emit(testResultData);
                this.snackBar.open('RBOT Fail Time test saved successfully', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            },
            error: (error) => {
                this.isLoading.set(false);
                this.snackBar.open('Error saving RBOT Fail Time test: ' + error.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            }
        });
    }
}
