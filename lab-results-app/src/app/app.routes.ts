import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'test-results',
        loadComponent: () => import('./components/test-results-list/test-results-list.component').then(m => m.TestResultsListComponent)
    },
    {
        path: 'test-results/:sampleId/:testId',
        loadComponent: () => import('./components/test-result-entry/test-result-entry.component').then(m => m.TestResultEntryComponent)
    },
    {
        path: 'samples',
        loadComponent: () => import('./components/samples/samples.component').then(m => m.SamplesComponent)
    },
    {
        path: 'equipment',
        loadComponent: () => import('./components/equipment/equipment.component').then(m => m.EquipmentComponent)
    },
    {
        path: 'reports',
        loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent)
    },
    {
        path: '**',
        redirectTo: '/dashboard'
    }
];
