import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { TanEntryComponent } from './tan-entry.component';
import { TestResultService } from '../../services/test-result.service';
import { TanTestDto } from '../../models/test-result.models';

describe('TanEntryComponent', () => {
    let component: TanEntryComponent;
    let fixture: ComponentFixture<TanEntryComponent>;
    let mockTestResultService: jasmine.SpyObj<TestResultService>;
    let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

    beforeEach(async () => {
        const testResultServiceSpy = jasmine.createSpyObj('TestResultService', ['saveTanTest']);
        const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

        await TestBed.configureTestingModule({
            imports: [
                TanEntryComponent,
                ReactiveFormsModule,
                MatCardModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                MatIconModule,
                BrowserAnimationsModule
            ],
            providers: [
                { provide: TestResultService, useValue: testResultServiceSpy },
                { provide: MatSnackBar, useValue: snackBarSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TanEntryComponent);
        component = fixture.componentInstance;
        mockTestResultService = TestBed.inject(TestResultService) as jasmine.SpyObj<TestResultService>;
        mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

        // Set required inputs
        component.sampleId = 1001;
        component.testId = 10;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
        expect(component.tanForm.get('sampleWeight')?.value).toBeNull();
        expect(component.tanForm.get('finalBuret')?.value).toBeNull();
        expect(component.tanForm.get('calculatedResult')?.value).toBeNull();
    });

    it('should calculate result when sample weight and final buret are provided', () => {
        component.tanForm.patchValue({
            sampleWeight: 5.0,
            finalBuret: 2.5
        });

        component.calculateResult();

        expect(component.tanForm.get('calculatedResult')?.value).toBe(2.8);
    });

    it('should not calculate result when required fields are missing', () => {
        component.tanForm.patchValue({
            sampleWeight: 5.0
            // finalBuret is missing
        });

        component.calculateResult();

        expect(component.tanForm.get('calculatedResult')?.value).toBeNull();
    });

    it('should save results successfully', () => {
        const mockDto: TanTestDto = {
            sampleId: 1001,
            testId: 10,
            trialNumber: 1,
            sampleWeight: 5.0,
            finalBuret: 2.5,
            calculatedResult: 2.8
        };

        mockTestResultService.saveTanTest.and.returnValue(of(mockDto));

        component.tanForm.patchValue({
            sampleWeight: 5.0,
            finalBuret: 2.5,
            calculatedResult: 2.8
        });

        component.saveResults();

        expect(mockTestResultService.saveTanTest).toHaveBeenCalledWith(jasmine.objectContaining({
            sampleId: 1001,
            testId: 10,
            trialNumber: 1,
            sampleWeight: 5.0,
            finalBuret: 2.5,
            calculatedResult: 2.8
        }));

        expect(mockSnackBar.open).toHaveBeenCalledWith('TAN results saved successfully!', 'Close', { duration: 3000 });
    });

    it('should handle save error', () => {
        const error = new Error('Save failed');
        mockTestResultService.saveTanTest.and.returnValue(throwError(() => error));

        component.tanForm.patchValue({
            sampleWeight: 5.0,
            finalBuret: 2.5,
            calculatedResult: 2.8
        });

        component.saveResults();

        expect(mockSnackBar.open).toHaveBeenCalledWith('Error saving TAN results: Save failed', 'Close', { duration: 3000 });
    });

    it('should not save when form is invalid', () => {
        component.tanForm.patchValue({
            sampleWeight: null,
            finalBuret: 2.5,
            calculatedResult: 2.8
        });

        component.saveResults();

        expect(mockTestResultService.saveTanTest).not.toHaveBeenCalled();
    });

    it('should clear form', () => {
        component.tanForm.patchValue({
            sampleWeight: 5.0,
            finalBuret: 2.5,
            calculatedResult: 2.8
        });

        component.clearForm();

        expect(component.tanForm.get('sampleWeight')?.value).toBeNull();
        expect(component.tanForm.get('finalBuret')?.value).toBeNull();
        expect(component.tanForm.get('calculatedResult')?.value).toBeNull();
    });

    it('should emit saveComplete event after successful save', () => {
        spyOn(component.saveComplete, 'emit');
        const mockDto: TanTestDto = {
            sampleId: 1001,
            testId: 10,
            trialNumber: 1,
            sampleWeight: 5.0,
            finalBuret: 2.5,
            calculatedResult: 2.8
        };

        mockTestResultService.saveTanTest.and.returnValue(of(mockDto));

        component.tanForm.patchValue({
            sampleWeight: 5.0,
            finalBuret: 2.5,
            calculatedResult: 2.8
        });

        component.saveResults();

        expect(component.saveComplete.emit).toHaveBeenCalled();
    });

    it('should validate required fields', () => {
        const sampleWeightControl = component.tanForm.get('sampleWeight');
        const finalBuretControl = component.tanForm.get('finalBuret');
        const calculatedResultControl = component.tanForm.get('calculatedResult');

        expect(sampleWeightControl?.hasError('required')).toBeTruthy();
        expect(finalBuretControl?.hasError('required')).toBeTruthy();
        expect(calculatedResultControl?.hasError('required')).toBeTruthy();
    });

    it('should validate numeric values', () => {
        component.tanForm.patchValue({
            sampleWeight: 'invalid',
            finalBuret: 'invalid',
            calculatedResult: 'invalid'
        });

        expect(component.tanForm.get('sampleWeight')?.hasError('pattern')).toBeTruthy();
        expect(component.tanForm.get('finalBuret')?.hasError('pattern')).toBeTruthy();
        expect(component.tanForm.get('calculatedResult')?.hasError('pattern')).toBeTruthy();
    });
});
