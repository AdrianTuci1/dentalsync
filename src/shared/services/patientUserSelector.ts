import { createSelector } from 'reselect';

// Input selectors
const selectPatientUserState = (state: any) => state.patientUser;

// Memoized selector
export const selectPatientData = createSelector(
  [selectPatientUserState],
  (patientUserState) => ({
    patients: patientUserState.patients || [],
    loading: patientUserState.loading,
  })
);