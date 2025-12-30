import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { ExpensePieChart } from '../components/ExpensePieChart';
import { ExpenseListItem } from '../components/ExpenseListItem';
import { AddExpenseModal } from '../components/AddExpenseModal';
import { expenseRepository } from '../database/repositories/expenseRepository';
import { accountRepository } from '../database/repositories/accountRepository';
import { Account, ExpenseWithAccount, CategorySummary } from '../types';
import { getLast7Days, getStartOfMonth, getToday, formatCurrency } from '../utils/dateUtils';

export const DashboardScreen: React.FC = () => {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showAddExpense, setShowAddExpense] = useState(false);

    const [weeklyData, setWeeklyData] = useState<CategorySummary[]>([]);
    const [monthlyData, setMonthlyData] = useState<CategorySummary[]>([]);
    const [weeklyTotal, setWeeklyTotal] = useState(0);
    const [monthlyTotal, setMonthlyTotal] = useState(0);
    const [recentExpenses, setRecentExpenses] = useState<ExpenseWithAccount[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);

    const loadData = useCallback(async () => {
        try {
            const today = getToday();
            const last7Days = getLast7Days();
            const monthStart = getStartOfMonth();

            const [
                weekly,
                monthly,
                weekTotal,
                monthTotal,
                recent,
                accts
            ] = await Promise.all([
                expenseRepository.getCategorySummary(last7Days, today),
                expenseRepository.getCategorySummary(monthStart, today),
                expenseRepository.getTotalSpend(last7Days, today),
                expenseRepository.getTotalSpend(monthStart, today),
                expenseRepository.getRecent(5),
                accountRepository.getAll(),
            ]);

            setWeeklyData(weekly);
            setMonthlyData(monthly);
            setWeeklyTotal(weekTotal);
            setMonthlyTotal(monthTotal);
            setRecentExpenses(recent);
            setAccounts(accts);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const handleAddExpense = async (data: {
        amount: number;
        category: string;
        account_id: number;
        date: Date;
        description: string;
    }) => {
        await expenseRepository.create(
            data.account_id,
            data.amount,
            data.category,
            data.date,
            data.description
        );
        loadData();
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <View>
                    <Text style={[styles.greeting, { color: colors.textMuted }]}>Welcome back</Text>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Dashboard</Text>
                </View>
                <ThemeToggle />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
            >
                {/* Summary Cards */}
                <View style={styles.summaryRow}>
                    <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
                        <View style={[styles.summaryIcon, { backgroundColor: colors.primary + '15' }]}>
                            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                        </View>
                        <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Last 7 Days</Text>
                        <Text style={[styles.summaryAmount, { color: colors.text }]}>
                            {formatCurrency(weeklyTotal)}
                        </Text>
                    </View>
                    <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
                        <View style={[styles.summaryIcon, { backgroundColor: colors.success + '15' }]}>
                            <Ionicons name="trending-up-outline" size={20} color={colors.success} />
                        </View>
                        <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>This Month</Text>
                        <Text style={[styles.summaryAmount, { color: colors.text }]}>
                            {formatCurrency(monthlyTotal)}
                        </Text>
                    </View>
                </View>

                {/* Weekly Chart */}
                <View style={styles.chartContainer}>
                    <ExpensePieChart
                        data={weeklyData}
                        title="Last 7 Days"
                        total={weeklyTotal}
                    />
                </View>

                {/* Monthly Chart */}
                <View style={styles.chartContainer}>
                    <ExpensePieChart
                        data={monthlyData}
                        title="This Month"
                        total={monthlyTotal}
                    />
                </View>

                {/* Recent Expenses */}
                {recentExpenses.length > 0 && (
                    <View style={styles.recentSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Recent Expenses
                        </Text>
                        {recentExpenses.map((expense) => (
                            <ExpenseListItem key={expense.id} expense={expense} />
                        ))}
                    </View>
                )}

                <View style={styles.bottomPadding} />
            </ScrollView>

            {/* Floating Add Button */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => setShowAddExpense(true)}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Add Expense Modal */}
            <AddExpenseModal
                visible={showAddExpense}
                onClose={() => setShowAddExpense(false)}
                onSubmit={handleAddExpense}
                accounts={accounts}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    greeting: {
        fontSize: 13,
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        marginTop: 2,
    },
    content: {
        flex: 1,
    },
    summaryRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 12,
    },
    summaryCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    summaryIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4,
    },
    summaryAmount: {
        fontSize: 20,
        fontWeight: '700',
    },
    chartContainer: {
        paddingHorizontal: 16,
    },
    recentSection: {
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 20,
        marginBottom: 8,
    },
    bottomPadding: {
        height: 100,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
});
