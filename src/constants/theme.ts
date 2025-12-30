// Theme colors for light and dark modes
export const lightTheme = {
    dark: false,
    colors: {
        primary: '#6366F1',
        primaryLight: '#818CF8',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceVariant: '#F1F5F9',
        text: '#1E293B',
        textSecondary: '#64748B',
        textMuted: '#94A3B8',
        border: '#E2E8F0',
        error: '#EF4444',
        success: '#22C55E',
        warning: '#F59E0B',
        card: '#FFFFFF',
        shadow: '#000000',
        tabBar: '#FFFFFF',
        tabBarInactive: '#94A3B8',
        chartBackground: '#FFFFFF',
    },
};

export const darkTheme = {
    dark: true,
    colors: {
        primary: '#818CF8',
        primaryLight: '#A5B4FC',
        background: '#0F172A',
        surface: '#1E293B',
        surfaceVariant: '#334155',
        text: '#F1F5F9',
        textSecondary: '#94A3B8',
        textMuted: '#64748B',
        border: '#334155',
        error: '#F87171',
        success: '#4ADE80',
        warning: '#FBBF24',
        card: '#1E293B',
        shadow: '#000000',
        tabBar: '#1E293B',
        tabBarInactive: '#64748B',
        chartBackground: '#1E293B',
    },
};

export type ThemeColors = typeof lightTheme.colors;
