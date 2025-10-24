// Authentication utility functions

export interface UserData {
  username: string;
  avatar?: string;
}

export const setAuthToken = (token: string, userData: UserData) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('userData', JSON.stringify(userData));
  // Dispatch custom event to notify all components
  window.dispatchEvent(new CustomEvent('authStateChange', { 
    detail: { isAuthenticated: true, userData } 
  }));
};

export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  // Dispatch custom event to notify all components
  window.dispatchEvent(new CustomEvent('authStateChange', { 
    detail: { isAuthenticated: false, userData: null } 
  }));
};

export const getAuthStatus = (): { isAuthenticated: boolean; userData: UserData | null } => {
  try {
    const token = localStorage.getItem('authToken');
    const userDataStr = localStorage.getItem('userData');
    
    if (token && userDataStr) {
      return {
        isAuthenticated: true,
        userData: JSON.parse(userDataStr)
      };
    }
    
    return {
      isAuthenticated: false,
      userData: null
    };
  } catch (error) {
    console.error('Error getting auth status:', error);
    return {
      isAuthenticated: false,
      userData: null
    };
  }
};
