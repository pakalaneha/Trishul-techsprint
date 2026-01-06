import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

// Token management
const TOKEN_KEY = '@aura_auth_token';
const USER_KEY = '@aura_user';

/**
 * Flask API Service
 * Handles all communication with the Flask backend
 */
export const FlaskApiService = {
    // ============================================
    // AUTHENTICATION
    // ============================================

    /**
     * Login user
     */
    login: async (username: string, password: string, latitude?: number, longitude?: number) => {
        try {
            const formData = new FormData();
            formData.append('username', username.toLowerCase());
            formData.append('password', password);

            if (latitude && longitude) {
                formData.append('latitude', latitude.toString());
                formData.append('longitude', longitude.toString());
            }

            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Invalid username or password');
            }

            const data = await response.json();

            // Store user data returned from Flask
            const userData = {
                ...data.user,
                loggedIn: true,
            };

            await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

            return userData;
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Login failed');
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
        latitude?: number;
        longitude?: number;
    }) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('username', data.username.toLowerCase().trim().replace(/\s/g, ''));
            formData.append('email', data.email.toLowerCase());
            formData.append('phone', data.phone);
            formData.append('password', data.password);

            if (data.latitude && data.longitude) {
                formData.append('latitude', data.latitude.toString());
                formData.append('longitude', data.longitude.toString());
            }

            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const html = await response.text();
                if (html.includes('Username already exists')) {
                    throw new Error('Username already exists');
                }
                throw new Error('Signup failed');
            }

            return { success: true, needsQuiz: true };
        } catch (error: any) {
            console.error('Signup error:', error);
            throw new Error(error.message || 'Signup failed');
        }
    },

    /**
     * Logout user
     */
    logout: async () => {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
            await AsyncStorage.removeItem(USER_KEY);

            // Call Flask logout endpoint
            await fetch(`${API_URL}/logout`, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    /**
     * Get stored user data
     */
    getCurrentUser: async () => {
        try {
            const userData = await AsyncStorage.getItem(USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    },

    // ============================================
    // AI FEATURES
    // ============================================

    /**
     * Analyze skin tone using DeepFace
     */
    analyzeSkinTone: async (imageUri: string) => {
        try {
            const user = await FlaskApiService.getCurrentUser();
            const formData = new FormData();
            if (user?.username) formData.append('username', user.username);

            // Upload image file
            const filename = imageUri.split('/').pop() || 'photo.jpg';
            formData.append('profile_pic', {
                uri: imageUri,
                type: 'image/jpeg',
                name: filename,
            } as any);

            const response = await fetch(`${API_URL}/api/skin-tone-detection`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Skin tone analysis failed');
            }

            const result = await response.json();

            // Transform Flask response to match Aura's expected format
            return {
                season: result.season || 'Spring',
                palette: result.recommended_colors || [],
                avoid: result.avoid_colors || [],
                description: result.description || 'Skin tone analyzed successfully',
                skinTone: result.skin_tone,
            };
        } catch (error: any) {
            console.error('Skin tone analysis error:', error);
            throw new Error(error.message || 'Failed to analyze skin tone');
        }
    },

    /**
     * Analyze skin type/condition
     */
    analyzeSkin: async (imageUri: string) => {
        try {
            const user = await FlaskApiService.getCurrentUser();
            const formData = new FormData();
            if (user?.username) formData.append('username', user.username);

            const filename = imageUri.split('/').pop() || 'photo.jpg';
            formData.append('image', {
                uri: imageUri,
                type: 'image/jpeg',
                name: filename,
            } as any);

            const response = await fetch(`${API_URL}/api/skin-analysis`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Skin analysis failed');
            }

            const result = await response.json();

            return {
                label: result.skin_type || 'Normal',
                confidence: result.confidence || 85,
                isClear: true,
                description: result.description || 'Skin analyzed successfully',
            };
        } catch (error: any) {
            console.error('Skin analysis error:', error);
            return {
                label: 'Normal',
                confidence: 85,
                isClear: true,
                description: 'Simulated: Normal skin detected',
            };
        }
    },

    /**
     * Analyze body shape
     */
    analyzeBodyShape: async (params: { imageUri?: string; measurements?: any }) => {
        try {
            const user = await FlaskApiService.getCurrentUser();
            const formData = new FormData();
            if (user?.username) formData.append('username', user.username);

            if (params.imageUri) {
                const filename = params.imageUri.split('/').pop() || 'photo.jpg';
                formData.append('profile_pic', {
                    uri: params.imageUri,
                    type: 'image/jpeg',
                    name: filename,
                } as any);
            }

            if (params.measurements) {
                Object.keys(params.measurements).forEach(key => {
                    formData.append(key, params.measurements[key]);
                });
            }

            const response = await fetch(`${API_URL}/api/body-shape-analysis`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Body shape analysis failed');
            }

            return await response.json();
        } catch (error: any) {
            console.error('Body shape error:', error);
            throw new Error(error.message || 'Failed to analyze body shape');
        }
    },

    /**
     * Generate outfit recommendations
     */
    generateOutfit: async (context: {
        occasion: string;
        weather: string;
        mood: string;
        userProfile?: any;
    }) => {
        try {
            const user = await FlaskApiService.getCurrentUser();

            const formData = new FormData();
            formData.append('occasion', context.occasion);
            formData.append('weather', context.weather);
            formData.append('mood', context.mood);

            if (user?.username) {
                formData.append('username', user.username);
            }

            const response = await fetch(`${API_URL}/api/outfit-recommendation`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Outfit generation failed');
            }

            const result = await response.json();

            return {
                items: result.items || {
                    top: 'Recommended Top',
                    bottom: 'Recommended Bottom',
                    shoes: 'Recommended Shoes',
                    accessory: 'Recommended Accessory',
                },
                reasoning: result.reasoning || 'AI-powered recommendation',
                tips: result.tips || 'Style tip for your outfit',
                images: result.images || [],
            };
        } catch (error: any) {
            console.error('Outfit generation error:', error);
            throw new Error(error.message || 'Failed to generate outfit');
        }
    },

    /**
     * Get weather-based outfit recommendations
     */
    getWeatherOutfit: async (season: string, gender: string) => {
        try {
            const response = await fetch(`${API_URL}/api/weather-outfit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ season, gender }),
            });

            if (!response.ok) {
                throw new Error('Weather outfit recommendation failed');
            }

            const result = await response.json();
            return result.recommendations || [];
        } catch (error: any) {
            console.error('Weather outfit error:', error);
            return [];
        }
    },

    /**
     * Virtual try-on
     */
    virtualTryOn: async (userImageUri: string, clothingImageUri: string) => {
        try {
            const user = await FlaskApiService.getCurrentUser();

            if (!user?.username) {
                throw new Error('User not logged in');
            }

            const formData = new FormData();

            // Add user image
            formData.append('vton_img', {
                uri: userImageUri,
                type: 'image/jpeg',
                name: 'user.jpg',
            } as any);

            // Add clothing image
            formData.append('garm_img', {
                uri: clothingImageUri,
                type: 'image/jpeg',
                name: 'clothing.jpg',
            } as any);

            const response = await fetch(`${API_URL}/run_virtual_try_on`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Virtual try-on failed');
            }

            const result = await response.json();

            if (result.status === 'processing') {
                // Poll for status
                return await FlaskApiService.pollVirtualTryOnStatus(
                    user.username,
                    'user',
                    'clothing'
                );
            }

            return result;
        } catch (error: any) {
            console.error('Virtual try-on error:', error);
            throw new Error(error.message || 'Virtual try-on failed');
        }
    },

    /**
     * Poll virtual try-on status
     */
    pollVirtualTryOnStatus: async (
        username: string,
        vtonImg: string,
        garmImg: string,
        maxAttempts = 30
    ) => {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const response = await fetch(
                    `${API_URL}/check_status/${username}/${vtonImg}/${garmImg}`,
                    { method: 'GET' }
                );

                if (response.ok) {
                    const result = await response.json();

                    if (result.status === 'completed') {
                        return {
                            success: true,
                            imageOne: `${API_URL}/${result.img_one}`,
                            imageTwo: `${API_URL}/${result.img_two}`,
                        };
                    } else if (result.status === 'failed') {
                        throw new Error(result.error || 'Virtual try-on failed');
                    }
                }

                // Wait 2 seconds before next poll
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                console.error('Poll error:', error);
            }
        }

        throw new Error('Virtual try-on timed out');
    },

    /**
     * Get wardrobe-based recommendations
     */
    getWardrobeRecommendation: async (imageUri: string) => {
        try {
            const formData = new FormData();

            formData.append('wardrobe_img', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'wardrobe.jpg',
            } as any);

            const response = await fetch(`${API_URL}/api/wardrobe-recommendation`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Wardrobe recommendation failed');
            }

            const result = await response.json();
            return result.recommendations || [];
        } catch (error: any) {
            console.error('Wardrobe recommendation error:', error);
            return [];
        }
    },

    // ============================================
    // PROFILE & DATA MANAGEMENT
    // ============================================

    /**
     * Submit style quiz
     */
    submitQuiz: async (quizData: any) => {
        try {
            const user = await FlaskApiService.getCurrentUser();
            const formData = new FormData();
            if (user?.username) formData.append('username', user.username);

            // Add all quiz fields
            if (quizData.styles) formData.append('styles', quizData.styles.join(','));
            if (quizData.goals) formData.append('goals', quizData.goals.join(','));
            if (quizData.colors_love) formData.append('fav_colors', quizData.colors_love.join(','));
            if (quizData.colors_avoid) formData.append('avoid_colors', quizData.colors_avoid.join(','));

            const response = await fetch(`${API_URL}/api/submit-quiz`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Quiz submission failed');
            }

            return { success: true };
        } catch (error: any) {
            console.error('Quiz submission error:', error);
            throw new Error(error.message || 'Failed to submit quiz');
        }
    },

    /**
     * Get user profile
     */
    getUserProfile: async () => {
        try {
            const user = await FlaskApiService.getCurrentUser();

            if (!user?.username) {
                throw new Error('User not logged in');
            }

            const response = await fetch(`${API_URL}/profile?username=${user.username}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            return await response.json();
        } catch (error: any) {
            console.error('Get profile error:', error);
            return null;
        }
    },

    /**
     * Save analysis result
     */
    saveAnalysis: async (type: string, data: any) => {
        try {
            const user = await FlaskApiService.getCurrentUser();

            if (!user?.username) {
                throw new Error('User not logged in');
            }

            // Store locally for now
            const key = `@aura_${type}_${user.username}`;
            await AsyncStorage.setItem(key, JSON.stringify(data));

            return { success: true };
        } catch (error: any) {
            console.error('Save analysis error:', error);
            throw new Error(error.message || 'Failed to save analysis');
        }
    },

    /**
     * Get saved analysis
     */
    getAnalysis: async (type: string) => {
        try {
            const user = await FlaskApiService.getCurrentUser();

            if (!user?.username) {
                return null;
            }

            const key = `@aura_${type}_${user.username}`;
            const data = await AsyncStorage.getItem(key);

            return data ? JSON.parse(data) : null;
        } catch (error: any) {
            console.error('Get analysis error:', error);
            return null;
        }
    },

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    /**
     * Get location data
     */
    getLocation: async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(`${API_URL}/get_location`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ latitude, longitude }),
            });

            if (!response.ok) {
                throw new Error('Failed to get location');
            }

            const result = await response.json();
            return {
                city: result.city,
                season: result.season,
            };
        } catch (error: any) {
            console.error('Get location error:', error);
            return {
                city: 'Unknown',
                season: 'Spring',
            };
        }
    },

    /**
     * Update user settings (Dark Mode, Notifications)
     */
    updateSettings: async (settings: { dark_mode?: boolean; notifications?: boolean }) => {
        try {
            const user = await FlaskApiService.getCurrentUser();
            if (!user?.username) throw new Error('User not logged in');

            const formData = new FormData();
            formData.append('username', user.username);
            if (settings.dark_mode !== undefined) formData.append('dark_mode', String(settings.dark_mode));
            if (settings.notifications !== undefined) formData.append('notifications', String(settings.notifications));

            const response = await fetch(`${API_URL}/api/update-settings`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to update settings');
            return { success: true };
        } catch (error: any) {
            console.error('Update settings error:', error);
            throw new Error(error.message || 'Failed to update settings');
        }
    },

    /**
     * Health check
     */
    healthCheck: async () => {
        try {
            const response = await fetch(`${API_URL}/`, {
                method: 'GET',
            });

            return response.ok;
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    },
};
