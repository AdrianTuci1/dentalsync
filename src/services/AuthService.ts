// src/services/AuthService.ts
class AuthService {
  private static instance: AuthService;
  private currentProfile: any = null;

  private constructor() {
    const savedProfile = localStorage.getItem('selectedProfile');
    if (savedProfile) {
      this.currentProfile = JSON.parse(savedProfile);
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Get the current profile
  public getProfile(): any {
    return this.currentProfile;
  }

  // Set a new profile and save it globally and to localStorage
  public setProfile(profile: any): void {
    this.currentProfile = profile;
    localStorage.setItem('selectedProfile', JSON.stringify(profile));
  }

  // Sign out and clear profile
  public signOut(): void {
    this.currentProfile = null;
    localStorage.removeItem('selectedProfile');
    localStorage.removeItem('token'); // Remove token as well
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return !!this.currentProfile;
  }

  // Change to a different profile
  public changeProfile(profile: any): void {
    this.setProfile(profile); // Use the setProfile method to update the current profile
  }
}

// src/services/authService.ts

export const fetchDemoProfiles = async () => {
  const loginUrl = `${import.meta.env.VITE_SERVER}/api/demo/login`;

  const response = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to load demo profiles');
  }

  const data = await response.json();
  return data.accounts || [];
};


export default AuthService.getInstance();
