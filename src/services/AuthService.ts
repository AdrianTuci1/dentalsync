class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Clinic login API call
  public async login(email: string, password: string, clinicDbName: string): Promise<any> {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-clinic-db': clinicDbName,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      return data; // Return user and subaccounts
    } else {
      throw new Error(data.message || 'Login failed.');
    }
  }

  // Subaccount PIN login API call
  public async pinLogin(subaccountId: number, pin: string, clinicDbName: string): Promise<any> {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/api/auth/subaccount/pin-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('clinicToken')}`, // Use token from localStorage
        'x-clinic-db': clinicDbName,
      },
      body: JSON.stringify({ subaccountId, pin }),
    });

    const data = await response.json();
    if (response.ok) {
      return data; // Return subaccount user data
    } else {
      throw new Error(data.message || 'PIN login failed.');
    }
  }
}

// Export an instance of AuthService
export default AuthService.getInstance();
