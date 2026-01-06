import { FlaskApiService } from './flaskApiService';

/**
 * Authentication Service
 * Handles user authentication using Flask backend
 */
export const AuthService = {
    /**
     * Login user
     */
    login: async (username: string, password: string) => {
        try {
            // Get user's location for weather-based features
            let latitude: number | undefined;
            let longitude: number | undefined;

            // Try to get location (optional)
            try {
                // In a real app, you'd use expo-location here
                // For now, we'll skip location
            } catch (error) {
                console.log('Location not available');
            }

            const userData = await FlaskApiService.login(username, password, latitude, longitude);
            return { success: true, user: userData };
        } catch (error: any) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Sign up new user
     */
    signup: async (data: {
        name: string;
        username: string;
        email: string;
        phone: string;
        password: string;
    }) => {
        try {
            const result = await FlaskApiService.signup(data);
            return { success: true, needsQuiz: result.needsQuiz };
        } catch (error: any) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Logout user
     */
    logout: async () => {
        try {
            await FlaskApiService.logout();
            return { success: true };
        } catch (error: any) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get current user
     */
    getCurrentUser: async () => {
        try {
            const user = await FlaskApiService.getCurrentUser();
            return user;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    },

    /**
     * Check if user is logged in
     */
    isLoggedIn: async () => {
        const user = await FlaskApiService.getCurrentUser();
        return user !== null && user.loggedIn === true;
    },
};
