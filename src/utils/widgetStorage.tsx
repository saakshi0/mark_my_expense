import React from 'react';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { MonthlySpendWidget } from '../widgets/MonthlySpendWidget';

// In-memory cache for widget data (updated when app syncs)
let cachedMonthlyTotal = '₹0';

/**
 * Format currency in INR format
 */
function formatCurrencyINR(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Save monthly total and refresh widget
 */
export function saveWidgetData(monthlyTotal: number): void {
    try {
        cachedMonthlyTotal = formatCurrencyINR(monthlyTotal);

        // Request widget refresh
        requestWidgetUpdate({
            widgetName: 'MonthlySpendWidget',
            renderWidget: () => <MonthlySpendWidget monthlyTotal={cachedMonthlyTotal} />,
            widgetNotFound: () => {
                // Widget not added to home screen yet - no action needed
            },
        });
    } catch (error) {
        console.error('Failed to update widget:', error);
    }
}

/**
 * Get cached monthly total for widget
 */
export function getCachedMonthlyTotal(): string {
    return cachedMonthlyTotal;
}
