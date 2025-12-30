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
        background: '#000000', // OLED Black
        surface: '#121212', // Slightly lighter for cards to distinguish from background
        surfaceVariant: '#27272a',
        text: '#FFFFFF', // Pure white for max contrast
        textSecondary: '#E2E8F0', // Very light gray
        textMuted: '#94A3B8',
        border: '#27272a',
        error: '#ff5555',
        success: '#4ADE80',
        warning: '#FBBF24',
        card: '#121212',
        shadow: '#FFFFFF', // White shadow for visibility on black if needed, or keep black for depth
        tabBar: '#121212',
        tabBarInactive: '#64748B',
        chartBackground: '#121212',
    },
};

export type ThemeColors = typeof lightTheme.colors;
