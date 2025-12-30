import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
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

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const onStartChange = (event: any, selectedDate?: Date) => {
        setShowStartPicker(false);
        if (selectedDate) {
            // Ensure start date is not after end date
            if (selectedDate > endDate) {
                // If start is after end, maybe just don't update or set end to start?
                // Better UX: just don't update or update and let user fix end. 
                // Following existing logic: newDate <= endDate
                return;
            }
            onStartDateChange(selectedDate);
        }
    };

    const onEndChange = (event: any, selectedDate?: Date) => {
        setShowEndPicker(false);
        if (selectedDate) {
            // Ensure end date is not before start date and not in future
            const today = new Date();
            today.setHours(23, 59, 59, 999);

            if (selectedDate < startDate || selectedDate > today) {
                return;
            }
            onEndDateChange(selectedDate);
        }
    };

    const setPreset = (preset: 'week' | 'month' | '3months' | 'all') => {
        const today = new Date();
        // today.setHours(23, 59, 59, 999); // No need to set time strict here, passing Date object is enough usually, but keeping consistency

        let start = new Date();

        switch (preset) {
            case 'week':
                start.setDate(today.getDate() - 7);
                break;
            case 'month':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case '3months':
                start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
                break;
            case 'all':
                start = new Date(2020, 0, 1);
                break;
        }

        // start.setHours(0, 0, 0, 0);
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
                <TouchableOpacity
                    style={[styles.dateBox, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => setShowStartPicker(true)}
                >
                    <View style={styles.dateContent}>
                        <Text style={[styles.dateLabel, { color: colors.textMuted }]}>From</Text>
                        <Text style={[styles.dateValue, { color: colors.text }]}>
                            {formatDateShort(startDate)}
                        </Text>
                    </View>
                    <Ionicons name="calendar-outline" size={18} color={colors.primary} style={styles.calendarIcon} />
                </TouchableOpacity>

                <Ionicons name="arrow-forward" size={20} color={colors.textMuted} />

                {/* End Date */}
                <TouchableOpacity
                    style={[styles.dateBox, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => setShowEndPicker(true)}
                >
                    <View style={styles.dateContent}>
                        <Text style={[styles.dateLabel, { color: colors.textMuted }]}>To</Text>
                        <Text style={[styles.dateValue, { color: colors.text }]}>
                            {formatDateShort(endDate)}
                        </Text>
                    </View>
                    <Ionicons name="calendar-outline" size={18} color={colors.primary} style={styles.calendarIcon} />
                </TouchableOpacity>
            </View>

            {showStartPicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={startDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onStartChange}
                    maximumDate={endDate}
                />
            )}

            {showEndPicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={endDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onEndChange}
                    minimumDate={startDate}
                    maximumDate={new Date()}
                />
            )}
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
    calendarIcon: {
        marginRight: 12,
    },
    dateContent: {
        flex: 1,
        paddingVertical: 12,
        paddingLeft: 16,
        alignItems: 'flex-start',
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
