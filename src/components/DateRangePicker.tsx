import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { formatDate, formatDateShort } from '../utils/dateUtils';

interface DateRangePickerProps {
    startDate: Date;
    endDate: Date;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
}) => {
    const { colors } = useTheme();

    const adjustStartDate = (days: number) => {
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + days);
        if (newDate <= endDate) {
            onStartDateChange(newDate);
        }
    };

    const adjustEndDate = (days: number) => {
        const newDate = new Date(endDate);
        newDate.setDate(newDate.getDate() + days);
        if (newDate >= startDate && newDate <= new Date()) {
            onEndDateChange(newDate);
        }
    };

    const setPreset = (preset: 'week' | 'month' | '3months' | 'all') => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        let start = new Date();

        switch (preset) {
            case 'week':
                start.setDate(today.getDate() - 7);
                break;
            case 'month':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case '3months':
                start = new Date(today.getFullYear(), today.getMonth() - 2, 1); // Current month - 2 gives 3 months span (e.g., Oct, Nov, Dec)
                break;
            case 'all':
                start = new Date(2020, 0, 1);
                break;
        }

        start.setHours(0, 0, 0, 0);
        onStartDateChange(start);
        onEndDateChange(today);
    };

    return (
        <View style={styles.container}>
            {/* Preset Buttons */}
            <View style={styles.presets}>
                <TouchableOpacity
                    style={[styles.presetButton, { backgroundColor: colors.surfaceVariant }]}
                    onPress={() => setPreset('week')}
                >
                    <Text style={[styles.presetText, { color: colors.text }]}>7 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.presetButton, { backgroundColor: colors.surfaceVariant }]}
                    onPress={() => setPreset('month')}
                >
                    <Text style={[styles.presetText, { color: colors.text }]}>This Month</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.presetButton, { backgroundColor: colors.surfaceVariant }]}
                    onPress={() => setPreset('3months')}
                >
                    <Text style={[styles.presetText, { color: colors.text }]}>Last 3 Months</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.presetButton, { backgroundColor: colors.surfaceVariant, opacity: 0.7 }]}
                    onPress={() => setPreset('all')}
                >
                    <Text style={[styles.presetText, { color: colors.text }]}>All Time</Text>
                </TouchableOpacity>
            </View>

            {/* Date Range Selector */}
            <View style={styles.dateRange}>
                {/* Start Date */}
                <View style={[styles.dateBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <TouchableOpacity onPress={() => adjustStartDate(-1)} style={styles.arrow}>
                        <Ionicons name="chevron-back" size={18} color={colors.primary} />
                    </TouchableOpacity>
                    <View style={styles.dateContent}>
                        <Text style={[styles.dateLabel, { color: colors.textMuted }]}>From</Text>
                        <Text style={[styles.dateValue, { color: colors.text }]}>
                            {formatDateShort(startDate)}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => adjustStartDate(1)} style={styles.arrow}>
                        <Ionicons name="chevron-forward" size={18} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                <Ionicons name="arrow-forward" size={20} color={colors.textMuted} />

                {/* End Date */}
                <View style={[styles.dateBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <TouchableOpacity onPress={() => adjustEndDate(-1)} style={styles.arrow}>
                        <Ionicons name="chevron-back" size={18} color={colors.primary} />
                    </TouchableOpacity>
                    <View style={styles.dateContent}>
                        <Text style={[styles.dateLabel, { color: colors.textMuted }]}>To</Text>
                        <Text style={[styles.dateValue, { color: colors.text }]}>
                            {formatDateShort(endDate)}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => adjustEndDate(1)}
                        style={styles.arrow}
                        disabled={endDate.toDateString() === new Date().toDateString()}
                    >
                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={endDate.toDateString() === new Date().toDateString() ? colors.textMuted : colors.primary}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    presets: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    presetButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    presetText: {
        fontSize: 12,
        fontWeight: '500',
    },
    dateRange: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dateBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    arrow: {
        padding: 10,
    },
    dateContent: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    dateLabel: {
        fontSize: 10,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dateValue: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 2,
    },
});
