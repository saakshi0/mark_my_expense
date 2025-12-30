import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { ExpensePieChart } from '../components/ExpensePieChart';
import { ExpenseListItem } from '../components/ExpenseListItem';
import { DateRangePicker } from '../components/DateRangePicker';
import { CategoryFilter } from '../components/CategoryFilter';
import { AccountPicker } from '../components/AccountPicker';
import { expenseRepository } from '../database/repositories/expenseRepository';
import { accountRepository } from '../database/repositories/accountRepository';
import { Account, ExpenseWithAccount, CategorySummary } from '../types';
import { getLast7Days, getToday, formatCurrency } from '../utils/dateUtils';

export const ExpensesScreen: React.FC = () => {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [startDate, setStartDate] = useState(getLast7Days());
    const [endDate, setEndDate] = useState(getToday());
    const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const [expenses, setExpenses] = useState<ExpenseWithAccount[]>([]);
    const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [total, setTotal] = useState(0);

    const loadData = useCallback(async () => {
        try {
            const [expensesList, summary, totalSpend, accts] = await Promise.all([
                expenseRepository.getByDateRange(startDate, endDate, selectedAccountId || undefined),
                expenseRepository.getCategorySummary(startDate, endDate, selectedAccountId || undefined),
                expenseRepository.getTotalSpend(startDate, endDate, selectedAccountId || undefined),
                accountRepository.getAll(),
            ]);

            setExpenses(expensesList);
            setCategorySummary(summary);
            setTotal(totalSpend);
            setAccounts(accts);
        } catch (error) {
            console.error('Failed to load expenses:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [startDate, endDate, selectedAccountId]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    // Filter expenses by category
    const filteredExpenses = selectedCategory
        ? expenses.filter(e => e.category === selectedCategory)
        : expenses;

    const renderHeader = () => (
        <View>
            {/* Filters */}
            <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={(date) => {
                    setStartDate(date);
                    setLoading(true);
                }}
                onEndDateChange={(date) => {
                    setEndDate(date);
                    setLoading(true);
                }}
            />

            {/* Account Filter */}
            <View style={styles.accountFilter}>
                <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Account</Text>
                <View style={styles.accountPickerContainer}>
                    <AccountPicker
                        accounts={[{ id: 0, name: 'All Accounts', type: 'bank', created_at: '' }, ...accounts]}
                        selectedAccountId={selectedAccountId || 0}
                        onSelect={(id) => {
                            setSelectedAccountId(id === 0 ? null : id);
                            setLoading(true);
                        }}
                        placeholder="All Accounts"
                    />
                </View>
            </View>

            {/* Summary */}
            <View style={[styles.summaryBanner, { backgroundColor: colors.primary + '10' }]}>
                <Text style={[styles.summaryText, { color: colors.primary }]}>
                    Total: {formatCurrency(total)} ({expenses.length} expenses)
                </Text>
            </View>

            {/* Pie Chart */}
            <View style={styles.chartContainer}>
                <ExpensePieChart
                    data={categorySummary}
                    title="Expenses by Category"
                    total={total}
                />
            </View>

            {/* Category Filter */}
            <View style={styles.categoryFilterSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Expense List
                </Text>
                <CategoryFilter
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                />
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                {selectedCategory ? 'No expenses in this category' : 'No expenses found'}
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
                {selectedCategory ? 'Try selecting a different category' : 'Add your first expense from the Dashboard'}
            </Text>
        </View>
    );

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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Expenses</Text>
                <ThemeToggle />
            </View>

            <FlatList
                data={filteredExpenses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ExpenseListItem expense={item} />}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
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
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
    },
    accountFilter: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    filterLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    accountPickerContainer: {
        // Style for account picker container
    },
    summaryBanner: {
        marginHorizontal: 16,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    summaryText: {
        fontSize: 14,
        fontWeight: '600',
    },
    chartContainer: {
        paddingHorizontal: 16,
    },
    categoryFilterSection: {
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 16,
    },
    listContent: {
        paddingBottom: 30,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
});
