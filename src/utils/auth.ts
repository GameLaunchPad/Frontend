// Authentication utility functions

export interface UserData {
  username: string;
  avatar?: string;
  role?: 'admin' | 'user';
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

// Check if user has admin role
export const isAdmin = (): boolean => {
  try {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      return userData.role === 'admin';
    }
    return false;
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};

// Check if user has specific role
export const hasRole = (role: 'admin' | 'user'): boolean => {
  try {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      return userData.role === role;
    }
    return false;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};
