import { Component, input, output, signal, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { TestResultService } from '../../services/test-result.service';
import { ParticleType, ParticleTypeDefinition } from '../../models/test-result.models';

@Component({
    selector: 'app-inspect-filter-entry',
    template: `
    <mat-card class="test-entry-card">
      <mat-card-header>
        <mat-card-title>Inspect Filter Test Entry</mat-card-title>
        <mat-card-subtitle>Filter Inspection and Particle Analysis</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="inspectFilterForm" (ngSubmit)="onSubmit()">
          <!-- Overall Severity Selection -->
          <div class="form-section">
            <h3>Overall Severity</h3>
            <mat-radio-group formControlName="overallSeverity" class="severity-group">
              <mat-radio-button value="1">1 - Light</mat-radio-button>
              <mat-radio-button value="2">2 - Moderate</mat-radio-button>
              <mat-radio-button value="3">3 - Severe</mat-radio-button>
              <mat-radio-button value="4">4 - Critical</mat-radio-button>
            </mat-radio-group>
          </div>

          <!-- Volume of Oil Used -->
          <div class="form-section">
            <h3>Volume of Oil Used</h3>
            <mat-radio-group formControlName="volumeOfOil" class="volume-group">
              <mat-radio-button value="~500ml">~500ml</mat-radio-button>
              <mat-radio-button value="~250ml">~250ml</mat-radio-button>
              <mat-radio-button value="~ 50ml">~ 50ml</mat-radio-button>
              <mat-radio-button value="~25ml">~25ml</mat-radio-button>
              <mat-radio-button value="Appr.  X ml">Appr.  X ml</mat-radio-button>
            </mat-radio-group>
            
            <mat-form-field appearance="outline" class="form-field" *ngIf="inspectFilterForm.get('volumeOfOil')?.value === 'Appr.  X ml'">
              <mat-label>Approximate Volume (ml)</mat-label>
              <input matInput 
                     formControlName="customVolume"
                     type="number"
                     placeholder="Enter approximate volume">
            </mat-form-field>
          </div>

          <!-- Particle Type Analysis -->
          <div class="form-section">
            <h3>Particle Type Analysis</h3>
            <div formArrayName="particleTypes">
              <mat-expansion-panel 
                *ngFor="let particleType of particleTypesArray.controls; let i = index" 
                [formGroupName]="i"
                class="particle-type-panel">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    {{ getParticleTypeName(i) }}
                  </mat-panel-title>
                  <mat-panel-description>
                    Status: {{ getParticleTypeStatus(i) }}
                  </mat-panel-description>
                </mat-expansion-panel-header>

                <div class="particle-type-content">
                  <!-- Particle Type Status -->
                  <div class="form-row">
                    <mat-radio-group formControlName="status" class="status-group">
                      <mat-radio-button value="0">N/A</mat-radio-button>
                      <mat-radio-button value="1">Review</mat-radio-button>
                    </mat-radio-group>
                  </div>

                  <!-- Particle Type Details -->
                  <div class="particle-details" *ngIf="getParticleTypeDefinition(i) as definition">
                    <div class="form-row">
                      <div class="detail-item">
                        <strong>Type:</strong> {{ definition.type }}
                      </div>
                      <div class="detail-item">
                        <strong>Description:</strong> {{ definition.description }}
                      </div>
                    </div>

                    <!-- Images -->
                    <div class="form-row" *ngIf="definition.image1 || definition.image2">
                      <div class="image-container" *ngIf="definition.image1">
                        <img [src]="getImageUrl(definition.image1)" 
                             [alt]="definition.type + ' Image 1'"
                             class="particle-image"
                             (click)="openImagePreview(definition.image1)">
                      </div>
                      <div class="image-container" *ngIf="definition.image2">
                        <img [src]="getImageUrl(definition.image2)" 
                             [alt]="definition.type + ' Image 2'"
                             class="particle-image"
                             (click)="openImagePreview(definition.image2)">
                      </div>
                    </div>

                    <!-- Particle Type Evaluation -->
                    <div class="form-row" *ngIf="particleType.get('status')?.value === '1'">
                      <mat-tab-group>
                        <mat-tab label="Heat">
                          <div class="evaluation-options">
                            <mat-radio-group formControlName="heat">
                              <mat-radio-button *ngFor="let option of getHeatOptions()" [value]="option.value">
                                {{ option.label }}
                              </mat-radio-button>
                            </mat-radio-group>
                          </div>
                        </mat-tab>
                        
                        <mat-tab label="Concentration">
                          <div class="evaluation-options">
                            <mat-radio-group formControlName="concentration">
                              <mat-radio-button *ngFor="let option of getConcentrationOptions()" [value]="option.value">
                                {{ option.label }}
                              </mat-radio-button>
                            </mat-radio-group>
                          </div>
                        </mat-tab>
                        
                        <mat-tab label="Size, Ave">
                          <div class="evaluation-options">
                            <mat-radio-group formControlName="sizeAve">
                              <mat-radio-button *ngFor="let option of getSizeAveOptions()" [value]="option.value">
                                {{ option.label }}
                              </mat-radio-button>
                            </mat-radio-group>
                          </div>
                        </mat-tab>
                        
                        <mat-tab label="Size, Max">
                          <div class="evaluation-options">
                            <mat-radio-group formControlName="sizeMax">
                              <mat-radio-button *ngFor="let option of getSizeMaxOptions()" [value]="option.value">
                                {{ option.label }}
                              </mat-radio-button>
                            </mat-radio-group>
                          </div>
                        </mat-tab>
                        
                        <mat-tab label="Color">
                          <div class="evaluation-options">
                            <mat-radio-group formControlName="color">
                              <mat-radio-button *ngFor="let option of getColorOptions()" [value]="option.value">
                                {{ option.label }}
                              </mat-radio-button>
                            </mat-radio-group>
                          </div>
                        </mat-tab>
                        
                        <mat-tab label="Texture">
                          <div class="evaluation-options">
                            <mat-radio-group formControlName="texture">
                              <mat-radio-button *ngFor="let option of getTextureOptions()" [value]="option.value">
                                {{ option.label }}
                              </mat-radio-button>
                            </mat-radio-group>
                          </div>
                        </mat-tab>
                        
                        <mat-tab label="Composition">
                          <div class="evaluation-options">
                            <mat-radio-group formControlName="composition">
                              <mat-radio-button *ngFor="let option of getCompositionOptions()" [value]="option.value">
                                {{ option.label }}
                              </mat-radio-button>
                            </mat-radio-group>
                          </div>
                        </mat-tab>
                        
                        <mat-tab label="Severity">
                          <div class="evaluation-options">
                            <mat-radio-group formControlName="severity">
                              <mat-radio-button *ngFor="let option of getSeverityOptions()" [value]="option.value">
                                {{ option.label }}
                              </mat-radio-button>
                            </mat-radio-group>
                          </div>
                        </mat-tab>
                      </mat-tab-group>
                    </div>

                    <!-- Comments -->
                    <div class="form-row" *ngIf="particleType.get('status')?.value === '1'">
                      <mat-form-field appearance="outline" class="form-field full-width">
                        <mat-label>Comments</mat-label>
                        <textarea matInput 
                                  formControlName="comments"
                                  rows="3"
                                  placeholder="Enter comments for this particle type">
                        </textarea>
                      </mat-form-field>
                    </div>
                  </div>
                </div>
              </mat-expansion-panel>
            </div>
          </div>

          <!-- Main Comments -->
          <div class="form-section">
            <h3>Main Comments</h3>
            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>Comments from this characterization</mat-label>
              <textarea matInput 
                        formControlName="mainComments"
                        rows="4"
                        placeholder="Enter main comments">
              </textarea>
            </mat-form-field>
            <button type="button" 
                    mat-button 
                    (click)="addAllComments()"
                    class="add-comments-btn">
              <mat-icon>add</mat-icon>
              Add to main comment
            </button>
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
                [disabled]="!inspectFilterForm.valid || !inspectFilterForm.get('isSelected')?.value"
                [loading]="isLoading()">
          <mat-icon>save</mat-icon>
          Save Inspect Filter Test
        </button>
        
        <button mat-button 
                (click)="onClear()"
                [disabled]="isLoading()">
          <mat-icon>clear</mat-icon>
          Clear
        </button>
        
        <button mat-button 
                (click)="onPartialSave()"
                [disabled]="!inspectFilterForm.get('isSelected')?.value || isLoading()">
          <mat-icon>save_alt</mat-icon>
          Partial Save
        </button>
      </mat-card-actions>
    </mat-card>
  `,
    styles: [`
    .test-entry-card {
      max-width: 1200px;
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
    
    .severity-group, .status-group, .volume-group {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .particle-type-panel {
      margin-bottom: 8px;
    }
    
    .particle-type-content {
      padding: 16px 0;
    }
    
    .particle-details {
      margin-top: 16px;
    }
    
    .detail-item {
      margin-bottom: 8px;
    }
    
    .image-container {
      margin-right: 16px;
    }
    
    .particle-image {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .evaluation-options {
      padding: 16px;
    }
    
    .evaluation-options mat-radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .add-comments-btn {
      margin-top: 8px;
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
        MatSnackBarModule,
        MatRadioModule,
        MatExpansionModule,
        MatTabsModule
    ]
})
export class InspectFilterEntryComponent implements OnInit {
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
    particleTypeDefinitions = signal<ParticleTypeDefinition[]>([]);

    // Form
    inspectFilterForm: FormGroup;

    constructor() {
        this.inspectFilterForm = this.fb.group({
            overallSeverity: ['', Validators.required],
            volumeOfOil: ['', Validators.required],
            customVolume: [0],
            particleTypes: this.fb.array([]),
            mainComments: [''],
            isSelected: [true]
        });
    }

    ngOnInit(): void {
        this.loadParticleTypeDefinitions();
        this.initializeParticleTypes();
    }

    get particleTypesArray(): FormArray {
        return this.inspectFilterForm.get('particleTypes') as FormArray;
    }

    private loadParticleTypeDefinitions(): void {
        // In a real implementation, this would load from the service
        // For now, we'll create mock data for inspect filter particle types
        const mockDefinitions: ParticleTypeDefinition[] = [
            {
                id: 1,
                type: 'Major',
                description: 'Major particles found in filter inspection',
                image1: 'major_1.jpg',
                image2: 'major_2.jpg',
                active: 'Y',
                sortOrder: 1
            },
            {
                id: 2,
                type: 'Minor',
                description: 'Minor particles found in filter inspection',
                image1: 'minor_1.jpg',
                image2: 'minor_2.jpg',
                active: 'Y',
                sortOrder: 2
            },
            {
                id: 3,
                type: 'Trace',
                description: 'Trace particles found in filter inspection',
                image1: 'trace_1.jpg',
                image2: 'trace_2.jpg',
                active: 'Y',
                sortOrder: 3
            }
        ];

        this.particleTypeDefinitions.set(mockDefinitions);
    }

    private initializeParticleTypes(): void {
        const particleTypesArray = this.particleTypesArray;
        particleTypesArray.clear();

        this.particleTypeDefinitions().forEach(definition => {
            const particleTypeGroup = this.fb.group({
                particleTypeDefinitionId: [definition.id],
                status: ['0'], // Default to N/A
                heat: [''],
                concentration: [''],
                sizeAve: [''],
                sizeMax: [''],
                color: [''],
                texture: [''],
                composition: [''],
                severity: [''],
                comments: ['']
            });

            particleTypesArray.push(particleTypeGroup);
        });
    }

    getParticleTypeName(index: number): string {
        const definition = this.getParticleTypeDefinition(index);
        return definition ? definition.type : `Particle Type ${index + 1}`;
    }

    getParticleTypeStatus(index: number): string {
        const status = this.particleTypesArray.at(index).get('status')?.value;
        return status === '1' ? 'Review' : 'N/A';
    }

    getParticleTypeDefinition(index: number): ParticleTypeDefinition | null {
        const particleTypeId = this.particleTypesArray.at(index).get('particleTypeDefinitionId')?.value;
        return this.particleTypeDefinitions().find(d => d.id === particleTypeId) || null;
    }

    getImageUrl(imageName: string): string {
        return `/assets/images/particle-types/${imageName}`;
    }

    openImagePreview(imageName: string): void {
        // In a real implementation, this would open an image preview dialog
        window.open(this.getImageUrl(imageName), '_blank');
    }

    // Evaluation options - these would come from the database in a real implementation
    getHeatOptions() {
        return [
            { value: '1', label: 'Light' },
            { value: '2', label: 'Moderate' },
            { value: '3', label: 'Heavy' }
        ];
    }

    getConcentrationOptions() {
        return [
            { value: '1', label: 'Low' },
            { value: '2', label: 'Medium' },
            { value: '3', label: 'High' }
        ];
    }

    getSizeAveOptions() {
        return [
            { value: '1', label: 'Small (< 10μm)' },
            { value: '2', label: 'Medium (10-50μm)' },
            { value: '3', label: 'Large (> 50μm)' }
        ];
    }

    getSizeMaxOptions() {
        return [
            { value: '1', label: 'Small (< 25μm)' },
            { value: '2', label: 'Medium (25-100μm)' },
            { value: '3', label: 'Large (> 100μm)' }
        ];
    }

    getColorOptions() {
        return [
            { value: '1', label: 'Light' },
            { value: '2', label: 'Medium' },
            { value: '3', label: 'Dark' }
        ];
    }

    getTextureOptions() {
        return [
            { value: '1', label: 'Smooth' },
            { value: '2', label: 'Rough' },
            { value: '3', label: 'Irregular' }
        ];
    }

    getCompositionOptions() {
        return [
            { value: '1', label: 'Metallic' },
            { value: '2', label: 'Non-metallic' },
            { value: '3', label: 'Mixed' }
        ];
    }

    getSeverityOptions() {
        return [
            { value: '1', label: 'Light' },
            { value: '2', label: 'Moderate' },
            { value: '3', label: 'Severe' },
            { value: '4', label: 'Critical' }
        ];
    }

    addAllComments(): void {
        let allComments = '';

        this.particleTypesArray.controls.forEach((control, index) => {
            if (control.get('status')?.value === '1') {
                const definition = this.getParticleTypeDefinition(index);
                const comments = control.get('comments')?.value;

                if (comments && definition) {
                    allComments += `[${definition.type}]: ${comments}. `;
                }
            }
        });

        this.inspectFilterForm.patchValue({
            mainComments: allComments
        });
    }

    onSubmit(): void {
        if (this.inspectFilterForm.valid && this.inspectFilterForm.get('isSelected')?.value) {
            this.saveTestResult('S'); // Saved status
        }
    }

    onPartialSave(): void {
        if (this.inspectFilterForm.get('isSelected')?.value) {
            this.saveTestResult('A'); // Accepted status for partial save
        }
    }

    onClear(): void {
        this.inspectFilterForm.reset({
            overallSeverity: '',
            volumeOfOil: '',
            customVolume: 0,
            mainComments: '',
            isSelected: true
        });

        // Reset all particle types
        this.particleTypesArray.controls.forEach(control => {
            control.patchValue({
                status: '0',
                heat: '',
                concentration: '',
                sizeAve: '',
                sizeMax: '',
                color: '',
                texture: '',
                composition: '',
                severity: '',
                comments: ''
            });
        });

        this.cleared.emit();
    }

    private saveTestResult(status: string): void {
        if (!this.inspectFilterForm.valid) return;

        const formValue = this.inspectFilterForm.value;

        // Prepare particle types data
        const particleTypes: ParticleType[] = [];
        this.particleTypesArray.controls.forEach((control, index) => {
            if (control.get('status')?.value === '1') {
                const definition = this.getParticleTypeDefinition(index);
                if (definition) {
                    particleTypes.push({
                        sampleId: this.sampleId(),
                        testId: this.testId(),
                        particleTypeDefinitionId: definition.id,
                        status: control.get('status')?.value,
                        comments: control.get('comments')?.value,
                        heat: control.get('heat')?.value,
                        concentration: control.get('concentration')?.value,
                        sizeAve: control.get('sizeAve')?.value,
                        sizeMax: control.get('sizeMax')?.value,
                        color: control.get('color')?.value,
                        texture: control.get('texture')?.value,
                        composition: control.get('composition')?.value,
                        severity: control.get('severity')?.value,
                        subTypes: []
                    });
                }
            }
        });

        const testResultData = {
            sampleId: this.sampleId(),
            testId: this.testId(),
            trialNumber: this.trialNumber(),
            overallSeverity: formValue.overallSeverity,
            volumeOfOil: formValue.volumeOfOil,
            customVolume: formValue.customVolume,
            particleTypes: particleTypes,
            mainComments: formValue.mainComments,
            status: status,
            entryId: 'CURRENT_USER',
            entryDate: new Date()
        };

        this.isLoading.set(true);

        // Use the general test result save method for now
        this.testResultService.saveTestResults({
            sampleId: this.sampleId(),
            testId: this.testId(),
            mode: 'entry',
            entries: [{
                sampleId: this.sampleId(),
                testId: this.testId(),
                trialNumber: this.trialNumber(),
                value1: parseInt(formValue.overallSeverity),
                value2: formValue.customVolume || 0,
                id1: formValue.volumeOfOil,
                status: status,
                mainComments: formValue.mainComments,
                isPartialSave: status === 'A',
                isMediaReady: false,
                isDelete: false
            }],
            isPartialSave: status === 'A',
            isMediaReady: false,
            isDelete: false
        }).subscribe({
            next: (result) => {
                this.isLoading.set(false);
                this.saved.emit(testResultData);
                this.snackBar.open('Inspect Filter test saved successfully', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            },
            error: (error) => {
                this.isLoading.set(false);
                this.snackBar.open('Error saving Inspect Filter test: ' + error.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            }
        });
    }
}
