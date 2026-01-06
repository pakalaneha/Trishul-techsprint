import { FlaskApiService } from './flaskApiService';

/**
 * Database Service
 * Handles data persistence using Flask backend
 */
export const DatabaseService = {
    /**
     * Save color analysis results
     */
    saveColorAnalysis: async (userId: string, data: any) => {
        try {
            await FlaskApiService.saveAnalysis('color_analysis', data);
            return { success: true };
        } catch (error: any) {
            console.error('Save color analysis error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Save body shape results
     */
    saveBodyShape: async (userId: string, data: any) => {
        try {
            await FlaskApiService.saveAnalysis('body_shape', data);
            return { success: true };
        } catch (error: any) {
            console.error('Save body shape error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Save styler results
     */
    saveStylerResult: async (userId: string, data: any) => {
        try {
            await FlaskApiService.saveAnalysis('styler_result', data);
            return { success: true };
        } catch (error: any) {
            console.error('Save styler result error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Save skin analysis results
     */
    saveSkinAnalysis: async (userId: string, data: any) => {
        try {
            await FlaskApiService.saveAnalysis('skin_analysis', data);
            return { success: true };
        } catch (error: any) {
            console.error('Save skin analysis error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get user profile
     */
    getUserProfile: async (userId: string) => {
        try {
            const profile = await FlaskApiService.getUserProfile();
            return profile;
        } catch (error) {
            console.error('Get user profile error:', error);
            return null;
        }
    },

    /**
     * Get saved analysis
     */
    getAnalysis: async (userId: string, type: string) => {
        try {
            const data = await FlaskApiService.getAnalysis(type);
            return data;
        } catch (error) {
            console.error('Get analysis error:', error);
            return null;
        }
    },
};
