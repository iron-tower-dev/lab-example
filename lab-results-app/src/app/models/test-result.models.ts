export interface TestResultEntry {
    sampleId: number;
    testId: number;
    trialNumber: number;
    value1?: number;
    value2?: number;
    value3?: number;
    trialCalc?: number;
    id1?: string;
    id2?: string;
    id3?: string;
    status?: string;
    mainComments?: string;
    isPartialSave?: boolean;
    isMediaReady?: boolean;
    isDelete?: boolean;
}

export interface TestResultSave {
    sampleId: number;
    testId: number;
    mode: 'entry' | 'reviewaccept' | 'reviewreject';
    entries: TestResultEntry[];
    isPartialSave: boolean;
    isMediaReady: boolean;
    isDelete: boolean;
}

export interface TestResultResponse {
    success: boolean;
    errorMessage?: string;
    sqlError?: string;
}

export interface SampleInfo {
    id: number;
    tagNumber?: string;
    component?: string;
    componentName?: string;
    location?: string;
    locationName?: string;
    lubeType?: string;
    qualityClass?: string;
    newUsedFlag?: string;
    cnrLevel?: string;
    cnrText?: string;
    cnrColor?: string;
    fColor?: string;
}

export interface TestInfo {
    id: number;
    name?: string;
    abbrev?: string;
    shortAbbrev?: string;
    lab?: boolean;
    schedule?: boolean;
}

export interface UserQualification {
    employeeId: string;
    qualificationLevel: string;
    canEnter: boolean;
    canReview: boolean;
    canReviewOwn: boolean;
}

export interface Equipment {
    name: string;
    value?: string;
    displayText?: string;
    dueDate?: Date;
    isOverdue: boolean;
    suffix?: string;
}

export interface ParticleType {
    sampleId: number;
    testId: number;
    particleTypeDefinitionId: number;
    type?: string;
    description?: string;
    image1?: string;
    image2?: string;
    status?: string;
    comments?: string;
    heat?: string;
    concentration?: string;
    sizeAve?: string;
    sizeMax?: string;
    color?: string;
    texture?: string;
    composition?: string;
    severity?: string;
    subTypes: ParticleSubType[];
}

export interface ParticleTypeDefinition {
    id: number;
    type: string;
    description: string;
    image1: string;
    image2: string;
    active: string;
    sortOrder: number;
}

export interface ParticleSubType {
    particleSubTypeCategoryId: number;
    categoryDescription?: string;
    value?: number;
}

export interface ParticleTypeCategory {
    id: number;
    description?: string;
    subTypeCount: number;
    sortOrder: number;
}

export interface ParticleSubTypeDefinition {
    id: number;
    categoryId: number;
    categoryDescription?: string;
    value?: number;
    description?: string;
    sortOrder?: number;
}

// Test-specific DTOs
export interface TanTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    sampleWeight: number;
    finalBuret: number;
    tanCalculated: number;
    equipmentId?: string;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface EmissionSpectroDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    Na?: number;
    Mo?: number;
    Mg?: number;
    P?: number;
    B?: number;
    H?: number;
    Cr?: number;
    Ca?: number;
    Ni?: number;
    Ag?: number;
    Cu?: number;
    Sn?: number;
    Al?: number;
    Mn?: number;
    Pb?: number;
    Fe?: number;
    Si?: number;
    Ba?: number;
    Sb?: number;
    Zn?: number;
    trialDate?: Date;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
    scheduleNextTest: boolean;
}

export interface ViscosityTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    thermometerMteId?: string;
    timerMteId?: string;
    viscometerId?: string;
    stopWatchTime: number;
    cstResult: number;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface FtirTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    deltaArea?: number;
    antiOxidant?: number;
    oxidation?: number;
    h2o?: number;
    antiWear?: number;
    soot?: number;
    fuelDilution?: number;
    mixture?: number;
    weakAcid?: number;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface FlashPointTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    barometerMteId?: string;
    thermometerMteId?: string;
    barometricPressure: number;
    flashPointTemperature: number;
    result: number;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface ParticleCountTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    micron5_10?: number;
    micron10_15?: number;
    micron15_25?: number;
    micron25_50?: number;
    micron50_100?: number;
    micron100?: number;
    isoCode?: string;
    nasClass?: string;
    testDate?: Date;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface GreasePenetrationTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    firstPenetration: number;
    secondPenetration: number;
    thirdPenetration: number;
    result: number;
    nlgi?: string;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface DroppingPointTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    droppingPointThermometerId?: string;
    blockThermometerId?: string;
    droppingPointTemperature: number;
    blockTemperature: number;
    result: number;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface RbotTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    thermometerMteId?: string;
    failTime: number;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface OxidationStabilityTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    thermometerMteId?: string;
    passFailResult: number; // 1=Pass, 2=Light Fail, 3=Moderate Fail, 4=Severe Fail
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface DeleteriousTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    deleteriousMteId?: string;
    pressure: number;
    scratches: number;
    passFail: string; // "pass" or "fail"
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface RheometerTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

// Additional test-specific DTOs
export interface SimpleResultTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    value1?: number;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface FilterInspectionTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    major?: string;
    minor?: string;
    trace?: string;
    narrative?: string;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface FilterResidueTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    sampleSize?: number;
    residueWeight?: number;
    finalWeight?: number;
    major?: string;
    minor?: string;
    trace?: string;
    narrative?: string;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface SimpleSelectTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    thermometerId?: string;
    result?: string; // Pass, Fail - Light, Fail - Moderate, Fail - Severe
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface RbotFailTimeTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    thermometerId?: string;
    failTime?: number;
    fileData?: string;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface InspectFilterTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    volumeOfOilUsed?: string; // ~500ml, ~250ml, ~50ml, ~25ml, Appr. X ml
    major?: string;
    minor?: string;
    trace?: string;
    narrative?: string;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface DInchTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    dInch?: number;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface OilContentTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    oilContent?: number;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface VarnishPotentialTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    varnishPotentialRating?: number;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface ViscosityTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    thermometerMteId?: string;
    timerMteId?: string;
    viscometerId?: string;
    stopWatchTime: number;
    cstResult: number;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface GreasePenetrationTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    firstPenetration: number;
    secondPenetration: number;
    thirdPenetration: number;
    result: number;
    nlgi?: string;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export interface DroppingPointTestDto {
    sampleId: number;
    testId: number;
    trialNumber: number;
    droppingPointThermometerId?: string;
    blockThermometerId?: string;
    droppingPointTemperature: number;
    blockTemperature: number;
    result: number;
    status: string;
    comments?: string;
    entryId?: string;
    entryDate?: Date;
}

export type TestMode = 'entry' | 'review' | 'view';
export type TestStatus = 'X' | 'A' | 'S' | 'T' | 'E' | 'P' | 'C' | 'D';
export type QualificationLevel = 'Q/QAG' | 'MicrE' | 'TRAIN';
