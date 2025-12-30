import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { CategorySummary } from '../types';
import { getCategoryById, getCategoryColor } from '../constants/categories';
import { formatCurrency } from '../utils/dateUtils';

interface ExpensePieChartProps {
    data: CategorySummary[];
    title?: string;
    total?: number;
}

const screenWidth = Dimensions.get('window').width;

export const ExpensePieChart: React.FC<ExpensePieChartProps> = ({
    data,
    title,
    total
}) => {
    const { colors, isDark } = useTheme();

    const chartData = useMemo(() => {
        if (data.length === 0) return [];

        return data.map((item) => ({
            name: getCategoryById(item.category).name,
            amount: item.total,
            color: getCategoryColor(item.category),
            legendFontColor: colors.textSecondary,
            legendFontSize: 11,
        }));
    }, [data, colors.textSecondary]);

    const calculatedTotal = total ?? data.reduce((sum, item) => sum + item.total, 0);

    if (data.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: colors.surface }]}>
                {title && (
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                )}
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                        No expenses yet
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
            {title && (
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    <Text style={[styles.total, { color: colors.primary }]}>
                        {formatCurrency(calculatedTotal)}
                    </Text>
                </View>
            )}
            <PieChart
                data={chartData}
                width={screenWidth - 48}
                height={180}
                chartConfig={{
                    backgroundColor: colors.surface,
                    backgroundGradientFrom: colors.surface,
                    backgroundGradientTo: colors.surface,
                    color: (opacity = 1) => `rgba(${isDark ? '255,255,255' : '0,0,0'}, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(${isDark ? '255,255,255' : '0,0,0'}, ${opacity})`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute
                hasLegend={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    total: {
        fontSize: 18,
        fontWeight: '700',
    },
    emptyContainer: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
    },
});
