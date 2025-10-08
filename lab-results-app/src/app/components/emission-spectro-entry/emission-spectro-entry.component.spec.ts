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
import { EmissionSpectroEntryComponent } from './emission-spectro-entry.component';
import { TestResultService } from '../../services/test-result.service';
import { EmissionSpectroDto } from '../../models/test-result.models';

describe('EmissionSpectroEntryComponent', () => {
    let component: EmissionSpectroEntryComponent;
    let fixture: ComponentFixture<EmissionSpectroEntryComponent>;
    let mockTestResultService: jasmine.SpyObj<TestResultService>;
    let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

    beforeEach(async () => {
        const testResultServiceSpy = jasmine.createSpyObj('TestResultService', ['saveEmissionSpectroTest']);
        const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

        await TestBed.configureTestingModule({
            imports: [
                EmissionSpectroEntryComponent,
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

        fixture = TestBed.createComponent(EmissionSpectroEntryComponent);
        component = fixture.componentInstance;
        mockTestResultService = TestBed.inject(TestResultService) as jasmine.SpyObj<TestResultService>;
        mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

        // Set required inputs
        component.sampleId = 1001;
        component.testId = 30;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
        expect(component.emissionSpectroForm.get('na')?.value).toBeNull();
        expect(component.emissionSpectroForm.get('fe')?.value).toBeNull();
        expect(component.emissionSpectroForm.get('cu')?.value).toBeNull();
    });

    it('should save results successfully', () => {
        const mockDto: EmissionSpectroDto = {
            sampleId: 1001,
            testId: 30,
            trialNumber: 1,
            Na: 10.5,
            Fe: 25.3,
            Cu: 5.2
        };

        mockTestResultService.saveEmissionSpectroTest.and.returnValue(of(mockDto));

        component.emissionSpectroForm.patchValue({
            na: 10.5,
            fe: 25.3,
            cu: 5.2
        });

        component.saveResults();

        expect(mockTestResultService.saveEmissionSpectroTest).toHaveBeenCalledWith(jasmine.objectContaining({
            sampleId: 1001,
            testId: 30,
            trialNumber: 1,
            Na: 10.5,
            Fe: 25.3,
            Cu: 5.2
        }));

        expect(mockSnackBar.open).toHaveBeenCalledWith('Emission Spectro results saved successfully!', 'Close', { duration: 3000 });
    });

    it('should handle save error', () => {
        const error = new Error('Save failed');
        mockTestResultService.saveEmissionSpectroTest.and.returnValue(throwError(() => error));

        component.emissionSpectroForm.patchValue({
            na: 10.5,
            fe: 25.3,
            cu: 5.2
        });

        component.saveResults();

        expect(mockSnackBar.open).toHaveBeenCalledWith('Error saving Emission Spectro results: Save failed', 'Close', { duration: 3000 });
    });

    it('should not save when form is invalid', () => {
        component.emissionSpectroForm.patchValue({
            na: null,
            fe: 25.3,
            cu: 5.2
        });

        component.saveResults();

        expect(mockTestResultService.saveEmissionSpectroTest).not.toHaveBeenCalled();
    });

    it('should clear form', () => {
        component.emissionSpectroForm.patchValue({
            na: 10.5,
            fe: 25.3,
            cu: 5.2
        });

        component.clearForm();

        expect(component.emissionSpectroForm.get('na')?.value).toBeNull();
        expect(component.emissionSpectroForm.get('fe')?.value).toBeNull();
        expect(component.emissionSpectroForm.get('cu')?.value).toBeNull();
    });
});
