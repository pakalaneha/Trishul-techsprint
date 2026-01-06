import { create } from 'zustand';

interface AuthState {
    user: any;
    isLoading: boolean;
    isAuthenticated: boolean;
    onboardingCompleted: boolean;
    setUser: (user: any) => void;
    setLoading: (isLoading: boolean) => void;
    setOnboardingCompleted: (completed: boolean) => void;
    logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    onboardingCompleted: false,
    setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
    setLoading: (isLoading) => set({ isLoading }),
    setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
    logout: () => set({ user: null, isAuthenticated: false, onboardingCompleted: false }),
}));
