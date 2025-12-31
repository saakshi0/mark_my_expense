import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/dateUtils';

interface TrendData {
    month: string;
    total: number;
}

interface SpendingGraphProps {
    data: TrendData[];
    title: string;
}

export const SpendingGraph: React.FC<SpendingGraphProps> = ({ data, title }) => {
    const { colors } = useTheme();
    const screenWidth = Dimensions.get('window').width;

    if (!data || data.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: colors.surface }]}>
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                        No data available for graph
                    </Text>
                </View>
            </View>
        );
    }

    // Format labels to be shorter (e.g., "2023-12" -> "Dec")
    const labels = data.map(item => {
        const date = new Date(item.month + '-01'); // Append day to make valid date
        return date.toLocaleString('default', { month: 'short' });
    });

    const values = data.map(item => item.total);

    return (
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <LineChart
                data={{
                    labels: labels,
                    datasets: [
                        {
                            data: values,
                        },
                    ],
                }}
                width={screenWidth - 32} // Increased width to use available space
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                yAxisInterval={1}
                chartConfig={{
                    backgroundColor: colors.surface,
                    backgroundGradientFrom: colors.surface,
                    backgroundGradientTo: colors.surface,
                    decimalPlaces: 0,
                    color: (opacity = 1) => colors.primary,
                    labelColor: (opacity = 1) => colors.textSecondary,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: colors.surface,
                    },
                    propsForBackgroundLines: {
                        strokeDasharray: '', // solid lines
                        stroke: colors.border + '40', // lighter border
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    paddingRight: 64, // Increase right padding for last label
                    paddingLeft: 16,  // Add left padding for Y-axis labels
                }}
                formatYLabel={(yValue) => {
                    // Simple currency formatting for Y-axis (e.g. 1k, 2k)
                    const num = parseInt(yValue);
                    if (num >= 1000) {
                        return (num / 1000).toFixed(1) + 'k';
                    }
                    return num.toString();
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    emptyContainer: {
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
    },
});
