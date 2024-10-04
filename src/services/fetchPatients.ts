// Fetch patient details
export const fetchPatient = async (patientId: string) => {
    const response = await fetch(`/api/patient/${patientId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch patient details');
    }
    const data = await response.json();
    return data;  // Assuming the response is the patient details
  };