import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
    const { colors } = useTheme();

    const chartData = useMemo(() => {
        if (data.length === 0) return [];

        // Sort by total descending
        return [...data].sort((a, b) => b.total - a.total).map((item) => {
            const category = getCategoryById(item.category);
            return {
                id: item.category,
                name: category.name,
                icon: category.icon,
                amount: item.total,
                color: getCategoryColor(item.category),
            };
        });
    }, [data]);

    const calculatedTotal = total ?? data.reduce((sum, item) => sum + item.total, 0);
    const maxAmount = useMemo(() => Math.max(...chartData.map(d => d.amount), 1), [chartData]);

    // Dynamic sizing based on number of categories
    const categoryCount = chartData.length;
    const barHeight = categoryCount > 8 ? 28 : categoryCount > 5 ? 32 : 36;
    const barGap = categoryCount > 8 ? 6 : categoryCount > 5 ? 8 : 10;
    const containerPadding = 16;

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
        <View style={[styles.container, { backgroundColor: colors.surface, padding: containerPadding }]}>
            {title && (
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    <Text style={[styles.total, { color: colors.primary }]}>
                        {formatCurrency(calculatedTotal)}
                    </Text>
                </View>
            )}
            <View style={styles.chartWrapper}>
                {chartData.map((item, index) => {
                    // Cap at 65% to leave room for the amount text
                    const barWidthPercent = Math.min((item.amount / maxAmount) * 65, 65);

                    return (
                        <View
                            key={item.id}
                            style={[
                                styles.barRow,
                                { marginBottom: index < chartData.length - 1 ? barGap : 0 }
                            ]}
                        >
                            {/* Category Icon */}
                            <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                                <Ionicons
                                    name={item.icon as any}
                                    size={barHeight > 32 ? 16 : 14}
                                    color={item.color}
                                />
                            </View>

                            {/* Bar Container */}
                            <View style={styles.barContainer}>
                                {/* Category Name */}
                                <Text
                                    style={[
                                        styles.categoryLabel,
                                        { color: colors.text, fontSize: barHeight > 32 ? 13 : 12 }
                                    ]}
                                    numberOfLines={1}
                                >
                                    {item.name}
                                </Text>

                                {/* Bar with Amount */}
                                <View style={styles.barWrapper}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                backgroundColor: item.color,
                                                width: `${Math.max(barWidthPercent, 5)}%`,
                                                height: barHeight * 0.5,
                                            }
                                        ]}
                                    />
                                    <Text
                                        style={[
                                            styles.amountLabel,
                                            {
                                                color: colors.textSecondary,
                                                fontSize: barHeight > 32 ? 12 : 11,
                                            }
                                        ]}
                                    >
                                        {formatCurrency(item.amount)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
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
        marginBottom: 16,
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
    chartWrapper: {
        width: '100%',
    },
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    barContainer: {
        flex: 1,
    },
    categoryLabel: {
        fontWeight: '500',
        marginBottom: 3,
    },
    barWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bar: {
        borderRadius: 4,
        minWidth: 20,
    },
    amountLabel: {
        marginLeft: 8,
        fontWeight: '600',
    },
});
