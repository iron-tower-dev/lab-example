import { Injectable, inject } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TestResultService } from './test-result.service';
import {
    TanTestDto,
    EmissionSpectroDto,
    ViscosityTestDto,
    FtirTestDto,
    FlashPointTestDto,
    ParticleCountTestDto,
    GreasePenetrationTestDto,
    DroppingPointTestDto,
    RbotTestDto,
    OxidationStabilityTestDto,
    DeleteriousTestDto,
    RheometerTestDto,
    ParticleType
} from '../models/test-result.models';

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export interface TestValidationRules {
    requiredFields: string[];
    numericRanges: { [key: string]: { min: number; max: number } };
    customValidations: { [key: string]: ValidatorFn };
    businessRules: string[];
}

@Injectable({
    providedIn: 'root'
})
export class ValidationService {
    private testResultService = inject(TestResultService);

    // Test-specific validation rules
    private readonly validationRules: { [testId: number]: TestValidationRules } = {
        10: { // TAN Test
            requiredFields: ['sampleWeight', 'finalBuret'],
            numericRanges: {
                sampleWeight: { min: 0.1, max: 100 },
                finalBuret: { min: 0, max: 50 }
            },
            customValidations: {
                sampleWeight: this.positiveNumberValidator(),
                finalBuret: this.positiveNumberValidator()
            },
            businessRules: [
                'Sample weight must be greater than 0',
                'Final buret reading must be non-negative',
                'TAN result must be calculated and within acceptable range (0.01 - 100)'
            ]
        },
        30: { // Emission Spectrometry (New)
            requiredFields: ['trialNumber'],
            numericRanges: {
                Na: { min: 0, max: 10000 },
                Mo: { min: 0, max: 10000 },
                Mg: { min: 0, max: 10000 },
                P: { min: 0, max: 10000 },
                B: { min: 0, max: 10000 },
                H: { min: 0, max: 10000 },
                Cr: { min: 0, max: 10000 },
                Ca: { min: 0, max: 10000 },
                Ni: { min: 0, max: 10000 },
                Ag: { min: 0, max: 10000 },
                Cu: { min: 0, max: 10000 },
                Sn: { min: 0, max: 10000 },
                Al: { min: 0, max: 10000 },
                Mn: { min: 0, max: 10000 },
                Pb: { min: 0, max: 10000 },
                Fe: { min: 0, max: 10000 },
                Si: { min: 0, max: 10000 },
                Ba: { min: 0, max: 10000 },
                Sb: { min: 0, max: 10000 },
                Zn: { min: 0, max: 10000 }
            },
            customValidations: {},
            businessRules: [
                'At least one element must have a value',
                'All element values must be non-negative',
                'Element values should be within typical PPM ranges'
            ]
        },
        40: { // Emission Spectrometry (Used)
            requiredFields: ['trialNumber'],
            numericRanges: {
                Na: { min: 0, max: 10000 },
                Mo: { min: 0, max: 10000 },
                Mg: { min: 0, max: 10000 },
                P: { min: 0, max: 10000 },
                B: { min: 0, max: 10000 },
                H: { min: 0, max: 10000 },
                Cr: { min: 0, max: 10000 },
                Ca: { min: 0, max: 10000 },
                Ni: { min: 0, max: 10000 },
                Ag: { min: 0, max: 10000 },
                Cu: { min: 0, max: 10000 },
                Sn: { min: 0, max: 10000 },
                Al: { min: 0, max: 10000 },
                Mn: { min: 0, max: 10000 },
                Pb: { min: 0, max: 10000 },
                Fe: { min: 0, max: 10000 },
                Si: { min: 0, max: 10000 },
                Ba: { min: 0, max: 10000 },
                Sb: { min: 0, max: 10000 },
                Zn: { min: 0, max: 10000 }
            },
            customValidations: {},
            businessRules: [
                'At least one element must have a value',
                'All element values must be non-negative',
                'Element values should be within typical PPM ranges'
            ]
        },
        50: { // Viscosity 40°C
            requiredFields: ['stopWatchTime', 'viscometerId'],
            numericRanges: {
                stopWatchTime: { min: 200, max: 3600 }
            },
            customValidations: {
                stopWatchTime: this.viscosityTimeValidator(),
                viscometerId: this.requiredValidator()
            },
            businessRules: [
                'Stop watch time must be greater than 200 seconds',
                'Viscometer must be selected',
                'For Q/QAG samples, two trials are required',
                'Repeatability between trials must be within 0.35%'
            ]
        },
        60: { // Viscosity 100°C
            requiredFields: ['stopWatchTime', 'viscometerId'],
            numericRanges: {
                stopWatchTime: { min: 200, max: 3600 }
            },
            customValidations: {
                stopWatchTime: this.viscosityTimeValidator(),
                viscometerId: this.requiredValidator()
            },
            businessRules: [
                'Stop watch time must be greater than 200 seconds',
                'Viscometer must be selected',
                'For Q/QAG samples, two trials are required',
                'Repeatability between trials must be within 0.35%'
            ]
        },
        70: { // FTIR
            requiredFields: ['trialNumber'],
            numericRanges: {
                deltaArea: { min: 0, max: 100 },
                antiOxidant: { min: 0, max: 100 },
                oxidation: { min: 0, max: 100 },
                h2o: { min: 0, max: 100 },
                antiWear: { min: 0, max: 100 },
                soot: { min: 0, max: 100 },
                fuelDilution: { min: 0, max: 100 },
                mixture: { min: 0, max: 100 },
                weakAcid: { min: 0, max: 100 }
            },
            customValidations: {},
            businessRules: [
                'At least one FTIR parameter must have a value',
                'All parameter values must be non-negative',
                'Parameter values should be within 0-100 range'
            ]
        },
        80: { // Flash Point
            requiredFields: ['barometricPressure', 'flashPointTemperature'],
            numericRanges: {
                barometricPressure: { min: 700, max: 800 },
                flashPointTemperature: { min: 50, max: 500 }
            },
            customValidations: {
                barometricPressure: this.barometricPressureValidator(),
                flashPointTemperature: this.temperatureValidator()
            },
            businessRules: [
                'Barometric pressure must be within 700-800 mm Hg',
                'Flash point temperature must be reasonable for the sample type',
                'Corrected flash point will be calculated automatically'
            ]
        },
        110: { // Simple Result
            requiredFields: ['result'],
            numericRanges: {
                result: { min: 0, max: 999999 }
            },
            customValidations: {
                result: this.positiveNumberValidator()
            },
            businessRules: [
                'Result must be a positive number',
                'Result should be within reasonable range for the test type'
            ]
        },
        120: { // Filter Inspection
            requiredFields: ['overallSeverity'],
            numericRanges: {
                overallSeverity: { min: 1, max: 4 }
            },
            customValidations: {
                overallSeverity: this.severityValidator()
            },
            businessRules: [
                'Overall severity must be selected (1-4)',
                'At least one particle type must be characterized',
                'All characterized particle types must have complete evaluations',
                'Comments are required for characterized particle types'
            ]
        },
        130: { // Grease Penetration Worked
            requiredFields: ['firstPenetration', 'secondPenetration', 'thirdPenetration'],
            numericRanges: {
                firstPenetration: { min: 0, max: 1000 },
                secondPenetration: { min: 0, max: 1000 },
                thirdPenetration: { min: 0, max: 1000 }
            },
            customValidations: {
                firstPenetration: this.penetrationValidator(),
                secondPenetration: this.penetrationValidator(),
                thirdPenetration: this.penetrationValidator()
            },
            businessRules: [
                'All three penetration values are required',
                'Penetration values must be within 0-1000 range',
                'NLGI grade will be calculated from average penetration',
                'Penetration values should be consistent'
            ]
        },
        140: { // Grease Dropping Point
            requiredFields: ['droppingPointTemperature', 'blockTemperature'],
            numericRanges: {
                droppingPointTemperature: { min: 50, max: 400 },
                blockTemperature: { min: 50, max: 400 }
            },
            customValidations: {
                droppingPointTemperature: this.temperatureValidator(),
                blockTemperature: this.temperatureValidator()
            },
            businessRules: [
                'Dropping point and block temperatures are required',
                'Temperatures must be within reasonable range',
                'Dropping point and block thermometers cannot be the same',
                'Corrected dropping point will be calculated'
            ]
        },
        160: { // Particle Count
            requiredFields: ['trialNumber'],
            numericRanges: {
                micron5_10: { min: 0, max: 1000000 },
                micron10_15: { min: 0, max: 1000000 },
                micron15_25: { min: 0, max: 1000000 },
                micron25_50: { min: 0, max: 1000000 },
                micron50_100: { min: 0, max: 1000000 },
                micron100: { min: 0, max: 1000000 }
            },
            customValidations: {},
            businessRules: [
                'At least one particle count range must have a value',
                'All particle counts must be non-negative',
                'ISO code and NAS class will be calculated automatically'
            ]
        },
        170: { // RBOT
            requiredFields: ['failTime'],
            numericRanges: {
                failTime: { min: 0, max: 10000 }
            },
            customValidations: {
                failTime: this.positiveNumberValidator()
            },
            businessRules: [
                'Fail time is required',
                'Fail time must be a positive number',
                'Fail time should be within reasonable range for RBOT test'
            ]
        },
        180: { // Filter Residue
            requiredFields: ['sampleSize', 'residueWeight', 'overallSeverity'],
            numericRanges: {
                sampleSize: { min: 0.1, max: 1000 },
                residueWeight: { min: 0, max: 1000 },
                overallSeverity: { min: 1, max: 4 }
            },
            customValidations: {
                sampleSize: this.positiveNumberValidator(),
                residueWeight: this.nonNegativeNumberValidator(),
                overallSeverity: this.severityValidator()
            },
            businessRules: [
                'Sample size and residue weight are required',
                'Sample size must be greater than 0',
                'Residue weight must be non-negative',
                'Overall severity must be selected',
                'At least one particle type must be characterized'
            ]
        },
        210: { // Ferrogram
            requiredFields: ['overallSeverity', 'dilutionFactor'],
            numericRanges: {
                overallSeverity: { min: 1, max: 4 }
            },
            customValidations: {
                overallSeverity: this.severityValidator(),
                dilutionFactor: this.requiredValidator()
            },
            businessRules: [
                'Overall severity must be selected',
                'Dilution factor must be specified',
                'At least one particle type must be characterized',
                'All characterized particle types must have complete evaluations'
            ]
        },
        220: { // Oxidation Stability
            requiredFields: ['passFailResult'],
            numericRanges: {},
            customValidations: {
                passFailResult: this.passFailValidator()
            },
            businessRules: [
                'Pass/Fail result must be selected',
                'For Q/QAG samples, recheck is required if any failures occur'
            ]
        },
        230: { // RBOT Fail Time
            requiredFields: ['failTime'],
            numericRanges: {
                failTime: { min: 0, max: 10000 }
            },
            customValidations: {
                failTime: this.positiveNumberValidator()
            },
            businessRules: [
                'Fail time is required',
                'Fail time must be a positive number'
            ]
        },
        240: { // Inspect Filter
            requiredFields: ['overallSeverity', 'volumeOfOil'],
            numericRanges: {
                overallSeverity: { min: 1, max: 4 }
            },
            customValidations: {
                overallSeverity: this.severityValidator(),
                volumeOfOil: this.requiredValidator()
            },
            businessRules: [
                'Overall severity must be selected',
                'Volume of oil used must be specified',
                'At least one particle type must be characterized'
            ]
        },
        250: { // Deleterious
            requiredFields: ['pressure', 'scratches', 'passFail'],
            numericRanges: {
                pressure: { min: 0, max: 10000 },
                scratches: { min: 0, max: 100 }
            },
            customValidations: {
                pressure: this.nonNegativeNumberValidator(),
                scratches: this.nonNegativeNumberValidator(),
                passFail: this.passFailValidator()
            },
            businessRules: [
                'Pressure and scratches values are required',
                'Pass/Fail result must be selected',
                'Values must be non-negative'
            ]
        },
        270: { // Simple Select
            requiredFields: ['testResult'],
            numericRanges: {},
            customValidations: {
                testResult: this.requiredValidator()
            },
            businessRules: [
                'Test result must be selected'
            ]
        },
        284: { // Rheometer D-inch
            requiredFields: ['dInch'],
            numericRanges: {
                dInch: { min: 0, max: 100 }
            },
            customValidations: {
                dInch: this.positiveNumberValidator()
            },
            businessRules: [
                'D-inch value is required',
                'D-inch must be a positive number'
            ]
        },
        285: { // Rheometer Oil Content
            requiredFields: ['oilContent'],
            numericRanges: {
                oilContent: { min: 0, max: 100 }
            },
            customValidations: {
                oilContent: this.positiveNumberValidator()
            },
            businessRules: [
                'Oil content value is required',
                'Oil content must be a positive number'
            ]
        },
        286: { // Rheometer Varnish Potential Rating
            requiredFields: ['varnishPotentialRating'],
            numericRanges: {
                varnishPotentialRating: { min: 0, max: 100 }
            },
            customValidations: {
                varnishPotentialRating: this.positiveNumberValidator()
            },
            businessRules: [
                'Varnish potential rating is required',
                'Rating must be a positive number'
            ]
        }
    };

    /**
     * Validates a test result based on the test type
     */
    validateTestResult(testId: number, testData: any, isPartialSave: boolean = false, qualityClass: string = ''): ValidationResult {
        const rules = this.validationRules[testId];
        if (!rules) {
            return {
                isValid: false,
                errors: [`No validation rules found for test ID ${testId}`],
                warnings: []
            };
        }

        const errors: string[] = [];
        const warnings: string[] = [];

        // 1. Validate required fields
        const requiredFieldsResult = this.validateRequiredFields(testId, testData, isPartialSave);
        errors.push(...requiredFieldsResult.errors);
        warnings.push(...requiredFieldsResult.warnings);

        // 2. Check numeric ranges
        for (const [field, range] of Object.entries(rules.numericRanges)) {
            const value = testData[field];
            if (value !== null && value !== undefined && value !== '') {
                const numValue = Number(value);
                if (isNaN(numValue)) {
                    errors.push(`${this.getFieldDisplayName(field)} must be a valid number`);
                } else {
                    if (numValue < range.min) {
                        errors.push(`${this.getFieldDisplayName(field)} must be at least ${range.min}`);
                    }
                    if (numValue > range.max) {
                        errors.push(`${this.getFieldDisplayName(field)} must not exceed ${range.max}`);
                    }
                }
            }
        }

        // 3. Apply custom validations
        for (const [field, validator] of Object.entries(rules.customValidations)) {
            const control = { value: testData[field] } as AbstractControl;
            const validationResult = validator(control);
            if (validationResult) {
                for (const [errorKey, errorMessage] of Object.entries(validationResult)) {
                    errors.push(`${this.getFieldDisplayName(field)}: ${errorMessage}`);
                }
            }
        }

        // 4. Validate test selection (at least one trial must be selected)
        const testSelectionResult = this.validateTestSelection(testData, testId);
        errors.push(...testSelectionResult.errors);
        warnings.push(...testSelectionResult.warnings);

        // 5. Apply test-specific business rules
        const businessRulesResult = this.validateTestSpecificRules(testId, testData, qualityClass, isPartialSave);
        errors.push(...businessRulesResult.errors);
        warnings.push(...businessRulesResult.warnings);

        // 6. Validate repeatability for multi-trial tests
        if (testData.trials && Array.isArray(testData.trials)) {
            const repeatabilityResult = this.validateRepeatability(testData.trials, testId, qualityClass);
            errors.push(...repeatabilityResult.errors);
            warnings.push(...repeatabilityResult.warnings);
        }

        // 7. Validate particle types for tests that require them
        if (testData.particleTypes && Array.isArray(testData.particleTypes)) {
            const particleValidationResult = this.validateParticleTypes(testData.particleTypes, testId);
            errors.push(...particleValidationResult.errors);
            warnings.push(...particleValidationResult.warnings);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Validates particle types for tests that require them
     */
    validateParticleTypes(particleTypes: ParticleType[], testId: number): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        if (!particleTypes || particleTypes.length === 0) {
            errors.push('At least one particle type must be characterized');
            return { isValid: false, errors, warnings };
        }

        const characterizedTypes = particleTypes.filter(pt => pt.status === '1');

        if (characterizedTypes.length === 0) {
            errors.push('At least one particle type must be set to "Review" status');
            return { isValid: false, errors, warnings };
        }

        // Validate each characterized particle type
        for (const particleType of characterizedTypes) {
            const missingFields: string[] = [];

            if (!particleType.heat) missingFields.push('Heat');
            if (!particleType.concentration) missingFields.push('Concentration');
            if (!particleType.sizeAve) missingFields.push('Size, Ave');
            if (!particleType.sizeMax) missingFields.push('Size, Max');
            if (!particleType.color) missingFields.push('Color');
            if (!particleType.texture) missingFields.push('Texture');
            if (!particleType.composition) missingFields.push('Composition');
            if (!particleType.severity) missingFields.push('Severity');

            if (missingFields.length > 0) {
                errors.push(`Particle type ${particleType.particleTypeDefinitionId}: Missing ${missingFields.join(', ')}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Validates equipment selection
     */
    validateEquipment(equipmentId: string, equipmentType: string, testId: number): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        if (!equipmentId) {
            errors.push(`${equipmentType} selection is required`);
            return { isValid: false, errors, warnings };
        }

        // Check if equipment is overdue (this would typically come from the service)
        // For now, we'll add a placeholder for this validation
        warnings.push('Equipment validation requires service integration');

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Validates user qualifications for a specific test
     */
    validateUserQualification(userId: string, testId: number): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        if (!userId) {
            errors.push('User ID is required');
            return { isValid: false, errors, warnings };
        }

        // This would typically check against the LubeTechQualification table
        // For now, we'll add a placeholder
        warnings.push('User qualification validation requires service integration');

        return {
            isValid: true,
            errors,
            warnings
        };
    }

    /**
     * Validates repeatability for tests that require multiple trials
     */
    validateRepeatability(trials: any[], testId: number, qualityClass: string): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        if (testId === 50 || testId === 60) { // Viscosity tests
            if (qualityClass === 'Q' || qualityClass === 'QAG') {
                if (trials.length < 2) {
                    errors.push('Two trials are required for Q/QAG samples');
                    return { isValid: false, errors, warnings };
                }

                // Check repeatability
                const values = trials.map(trial => trial.calculatedResult || trial.value3).filter(v => v > 0);
                if (values.length >= 2) {
                    const max = Math.max(...values);
                    const min = Math.min(...values);
                    const repeatability = ((max - min) / max) * 100;

                    if (repeatability > 0.35) {
                        errors.push(`Repeatability is ${repeatability.toFixed(2)}%, which exceeds the 0.35% limit`);
                    }
                }
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Validates test-specific business rules from VB application
     */
    validateTestSpecificRules(testId: number, testData: any, qualityClass: string, isPartialSave: boolean = false): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        switch (testId) {
            case 10: // TAN Test
                if (testData.sampleWeight && testData.finalBuret) {
                    const tanResult = ((testData.finalBuret * 5.61) / testData.sampleWeight) * 100;
                    if (tanResult < 0.01) {
                        warnings.push('Calculated TAN result is very low (< 0.01)');
                    }
                    if (tanResult > 100) {
                        warnings.push('Calculated TAN result is very high (> 100)');
                    }
                }
                break;

            case 50:
            case 60: // Viscosity tests
                if (testData.stopWatchTime && testData.stopWatchTime <= 200) {
                    errors.push('Stop watch time must be greater than 200 seconds');
                }
                // Q/QAG samples require two trials
                if ((qualityClass === 'Q' || qualityClass === 'QAG') && !isPartialSave) {
                    if (!testData.trial2 || !testData.trial2.stopWatchTime) {
                        errors.push('Two trials are required for Q/QAG samples');
                    }
                }
                break;

            case 70: // FTIR
                // Check if any data has been entered
                const hasData = Object.values(testData).some(value =>
                    value !== null && value !== undefined && value !== '' && value !== 0
                );
                if (!hasData && !isPartialSave) {
                    warnings.push('No FTIR data has been entered. Are you sure you want to save?');
                }
                break;

            case 80: // Flash Point
                if (testData.barometricPressure && testData.flashPointTemperature) {
                    const correctedFP = testData.flashPointTemperature + (0.06 * (760 - testData.barometricPressure));
                    testData.correctedFlashPoint = Math.round(correctedFP / 2) * 2;
                }
                break;

            case 120: // Filter Inspection
            case 180: // Filter Residue
            case 210: // Ferrogram
            case 240: // Inspect Filter
                // Overall severity must be selected
                if (!testData.overallSeverity) {
                    errors.push('Please select Overall Severity');
                }
                // At least one particle type must be characterized
                if (!testData.particleTypes || testData.particleTypes.length === 0) {
                    errors.push('At least 1 particle type should be characterized');
                } else {
                    const characterizedTypes = testData.particleTypes.filter((pt: any) => pt.status === '1');
                    if (characterizedTypes.length === 0) {
                        errors.push('At least 1 particle type should be characterized');
                    }
                    // Validate each characterized particle type
                    for (const particleType of characterizedTypes) {
                        const missingFields: string[] = [];
                        if (!particleType.heat) missingFields.push('Heat');
                        if (!particleType.concentration) missingFields.push('Concentration');
                        if (!particleType.sizeAve) missingFields.push('Size, Ave');
                        if (!particleType.sizeMax) missingFields.push('Size, Max');
                        if (!particleType.color) missingFields.push('Color');
                        if (!particleType.texture) missingFields.push('Texture');
                        if (!particleType.composition) missingFields.push('Composition');
                        if (!particleType.severity) missingFields.push('Severity');

                        if (missingFields.length > 0) {
                            errors.push(`Particle type ${particleType.type}: Missing ${missingFields.join(', ')}`);
                        }
                    }
                }
                // Comment length validation
                if (testData.mainComments && testData.mainComments.length > 1000) {
                    errors.push('Too many characters in Comments, please correct!');
                }
                break;

            case 130: // Grease Penetration Worked
                if (testData.firstPenetration && testData.secondPenetration && testData.thirdPenetration) {
                    const average = Math.round((testData.firstPenetration + testData.secondPenetration + testData.thirdPenetration) / 3);
                    testData.calculatedResult = (average * 3.75) + 24;
                }
                break;

            case 140: // Dropping Point
                if (testData.droppingPointTemperature && testData.blockTemperature) {
                    if (testData.droppingPointTemperature === testData.blockTemperature) {
                        errors.push('The dropping point and the block thermometers cannot be the same');
                    }
                    // Calculate corrected dropping point
                    testData.correctedDroppingPoint = Math.round(
                        testData.droppingPointTemperature + ((testData.blockTemperature - testData.droppingPointTemperature) / 3)
                    );
                }
                break;

            case 180: // Filter Residue
                if (!isPartialSave) {
                    if (!testData.sampleSize || !testData.residueWeight) {
                        errors.push('Please enter Sample Size and Residue Weight');
                    }
                }
                if (testData.sampleSize && testData.residueWeight) {
                    if (testData.sampleSize <= 0) {
                        errors.push('Sample size must be greater than 0');
                    }
                    // Calculate percentage
                    testData.percentage = testData.sampleSize > 0 ?
                        Math.round((100 / testData.sampleSize) * testData.residueWeight * 10) / 10 : 0;
                }
                break;

            case 220: // Oxidation Stability
                if (testData.passFailResult === 'fail' && !isPartialSave) {
                    warnings.push('Test failed - recheck may be required');
                }
                break;

            case 240: // Inspect Filter
                if (!isPartialSave) {
                    if (!testData.volumeOfOilUsed) {
                        errors.push('Please enter Volume of Oil Used');
                    }
                }
                break;

            case 250: // Deleterious
                if (testData.pressure && testData.scratches) {
                    if (testData.pressure < 0 || testData.scratches < 0) {
                        errors.push('Pressure and scratches values must be non-negative');
                    }
                }
                break;

            case 270: // Simple Select
                if (!testData.testResult) {
                    errors.push('Test result must be selected');
                }
                break;
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Validates that at least one test trial is selected for saving
     */
    validateTestSelection(testData: any, testId: number): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Check if any trial is selected for saving
        const hasSelectedTrial = Object.keys(testData).some(key =>
            key.startsWith('trial') && testData[key] && testData[key].isSelected
        );

        if (!hasSelectedTrial) {
            errors.push('Please ensure that you have checked a test to save');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Validates required fields for specific test types
     */
    validateRequiredFields(testId: number, testData: any, isPartialSave: boolean = false): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Get validation rules for this test
        const rules = this.validationRules[testId];
        if (!rules) {
            return { isValid: true, errors, warnings };
        }

        // Check required fields
        for (const field of rules.requiredFields) {
            if (!testData[field] && testData[field] !== 0) {
                errors.push(`${this.getFieldDisplayName(field)} is required`);
            }
        }

        // Test-specific required field validations
        switch (testId) {
            case 180: // Filter Residue
                if (!isPartialSave) {
                    if (!testData.sampleSize || !testData.residueWeight) {
                        errors.push('Sample Size and Residue Weight are required');
                    }
                }
                break;

            case 240: // Inspect Filter
                if (!isPartialSave) {
                    if (!testData.volumeOfOilUsed) {
                        errors.push('Volume of Oil Used is required');
                    }
                }
                break;
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    // Custom validators
    private positiveNumberValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (value === null || value === undefined || value === '') {
                return null; // Let required validator handle empty values
            }
            const num = Number(value);
            if (isNaN(num) || num <= 0) {
                return { positiveNumber: 'Value must be a positive number' };
            }
            return null;
        };
    }

    private nonNegativeNumberValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (value === null || value === undefined || value === '') {
                return null; // Let required validator handle empty values
            }
            const num = Number(value);
            if (isNaN(num) || num < 0) {
                return { nonNegativeNumber: 'Value must be a non-negative number' };
            }
            return null;
        };
    }

    private requiredValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (value === null || value === undefined || value === '') {
                return { required: 'This field is required' };
            }
            return null;
        };
    }

    private viscosityTimeValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (value === null || value === undefined || value === '') {
                return null; // Let required validator handle empty values
            }
            const num = Number(value);
            if (isNaN(num)) {
                return { invalidNumber: 'Value must be a valid number' };
            }
            if (num <= 200) {
                return { minTime: 'Stop watch time must be greater than 200 seconds' };
            }
            return null;
        };
    }

    private barometricPressureValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (value === null || value === undefined || value === '') {
                return null; // Let required validator handle empty values
            }
            const num = Number(value);
            if (isNaN(num)) {
                return { invalidNumber: 'Value must be a valid number' };
            }
            if (num < 700 || num > 800) {
                return { pressureRange: 'Barometric pressure must be between 700-800 mm Hg' };
            }
            return null;
        };
    }

    private temperatureValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (value === null || value === undefined || value === '') {
                return null; // Let required validator handle empty values
            }
            const num = Number(value);
            if (isNaN(num)) {
                return { invalidNumber: 'Value must be a valid number' };
            }
            if (num < 0 || num > 1000) {
                return { temperatureRange: 'Temperature must be between 0-1000°F' };
            }
            return null;
        };
    }

    private penetrationValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (value === null || value === undefined || value === '') {
                return null; // Let required validator handle empty values
            }
            const num = Number(value);
            if (isNaN(num)) {
                return { invalidNumber: 'Value must be a valid number' };
            }
            if (num < 0 || num > 1000) {
                return { penetrationRange: 'Penetration must be between 0-1000' };
            }
            return null;
        };
    }

    private severityValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (value === null || value === undefined || value === '') {
                return null; // Let required validator handle empty values
            }
            const num = Number(value);
            if (isNaN(num) || num < 1 || num > 4) {
                return { severityRange: 'Severity must be between 1-4' };
            }
            return null;
        };
    }

    private passFailValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (value === null || value === undefined || value === '') {
                return null; // Let required validator handle empty values
            }
            if (value !== 'pass' && value !== 'fail') {
                return { passFail: 'Value must be either "pass" or "fail"' };
            }
            return null;
        };
    }


    private getFieldDisplayName(field: string): string {
        const fieldNames: { [key: string]: string } = {
            sampleWeight: 'Sample Weight',
            finalBuret: 'Final Buret',
            stopWatchTime: 'Stop Watch Time',
            viscometerId: 'Viscometer',
            thermometerMteId: 'Thermometer',
            barometricPressure: 'Barometric Pressure',
            flashPointTemperature: 'Flash Point Temperature',
            overallSeverity: 'Overall Severity',
            firstPenetration: 'First Penetration',
            secondPenetration: 'Second Penetration',
            thirdPenetration: 'Third Penetration',
            droppingPointTemperature: 'Dropping Point Temperature',
            blockTemperature: 'Block Temperature',
            failTime: 'Fail Time',
            sampleSize: 'Sample Size',
            residueWeight: 'Residue Weight',
            dilutionFactor: 'Dilution Factor',
            passFailResult: 'Pass/Fail Result',
            pressure: 'Pressure',
            scratches: 'Scratches',
            testResult: 'Test Result',
            dInch: 'D-inch',
            oilContent: 'Oil Content',
            varnishPotentialRating: 'Varnish Potential Rating',
            volumeOfOil: 'Volume of Oil'
        };

        return fieldNames[field] || field;
    }
}
