import { Component, input, output, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TestResultService } from '../../services/test-result.service';

@Component({
    selector: 'app-file-data-entry',
    template: `
    <mat-card class="test-entry-card">
      <mat-card-header>
        <mat-card-title>File Data Import (Test ID 20)</mat-card-title>
        <mat-card-subtitle>Import test results from external files</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="fileDataForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Trial Number</mat-label>
              <input matInput formControlName="trialNumber" type="number" min="1" max="10">
              <mat-error *ngIf="fileDataForm.get('trialNumber')?.hasError('required')">
                Trial number is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Result Value</mat-label>
              <input matInput formControlName="result" type="number" step="0.01">
              <mat-error *ngIf="fileDataForm.get('result')?.hasError('required')">
                Result value is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>File Path</mat-label>
              <input matInput formControlName="filePath" placeholder="Path to imported file">
              <mat-icon matSuffix>folder_open</mat-icon>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Import Date</mat-label>
              <input matInput formControlName="importDate" type="datetime-local">
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Comments</mat-label>
              <textarea matInput formControlName="comments" rows="3" placeholder="Additional comments about the imported data"></textarea>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="fileDataForm.invalid || isSubmitting()">
              <mat-icon>save</mat-icon>
              Save File Data
            </button>
            
            <button mat-button type="button" (click)="onClear()" [disabled]="isSubmitting()">
              <mat-icon>clear</mat-icon>
              Clear
            </button>

            <button mat-button type="button" (click)="onFindFile()" [disabled]="isSubmitting()">
              <mat-icon>search</mat-icon>
              Find File
            </button>
          </div>
        </form>
      </mat-card-content>
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
    }
    
    .full-width {
      flex: 1;
    }
    
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }
    
    .form-actions button {
      min-width: 120px;
    }
  `],
    imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule
    ]
})
export class FileDataEntryComponent {
    private fb = inject(FormBuilder);
    private testResultService = inject(TestResultService);
    private snackBar = inject(MatSnackBar);

    sampleId = input.required<number>();
    testId = input.required<number>();
    testName = input.required<string>();

    resultSaved = output<void>();

    fileDataForm: FormGroup;
    isSubmitting = signal(false);

    constructor() {
        this.fileDataForm = this.fb.group({
            trialNumber: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
            result: [null, [Validators.required, Validators.min(0)]],
            filePath: ['', Validators.required],
            importDate: [new Date().toISOString().slice(0, 16)],
            comments: ['']
        });
    }

    onSubmit(): void {
        if (this.fileDataForm.valid) {
            this.isSubmitting.set(true);

            const formData = this.fileDataForm.value;
            const testData = {
                sampleId: this.sampleId(),
                testId: this.testId(),
                trialNumber: formData.trialNumber,
                value1: formData.result,
                filePath: formData.filePath,
                importDate: formData.importDate,
                mainComments: formData.comments
            };

            this.testResultService.saveTestResults({
                sampleId: this.sampleId(),
                testId: this.testId(),
                mode: 'entry',
                entries: [{
                    sampleId: this.sampleId(),
                    testId: this.testId(),
                    trialNumber: formData.trialNumber,
                    value1: formData.result,
                    value2: null,
                    value3: null,
                    id1: formData.filePath,
                    id2: formData.importDate,
                    id3: null,
                    status: 'S',
                    mainComments: formData.comments,
                    isPartialSave: false,
                    isMediaReady: false,
                    isDelete: false
                }],
                isPartialSave: false,
                isMediaReady: false,
                isDelete: false
            }).subscribe({
                next: (response) => {
                    this.snackBar.open('File data saved successfully', 'Close', { duration: 3000 });
                    this.resultSaved.emit();
                    this.isSubmitting.set(false);
                },
                error: (error) => {
                    this.snackBar.open('Error saving file data: ' + error.message, 'Close', { duration: 5000 });
                    this.isSubmitting.set(false);
                }
            });
        }
    }

    onClear(): void {
        this.fileDataForm.reset({
            trialNumber: 1,
            result: null,
            filePath: '',
            importDate: new Date().toISOString().slice(0, 16),
            comments: ''
        });
    }

    onFindFile(): void {
        // This would typically open a file dialog
        // For now, we'll just show a message
        this.snackBar.open('File finder functionality would be implemented here', 'Close', { duration: 3000 });
    }
}
