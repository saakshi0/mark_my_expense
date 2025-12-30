import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { ExpenseWithAccount } from '../types';
import { getCategoryById } from '../constants/categories';
import { formatCurrency, getRelativeDay } from '../utils/dateUtils';

interface ExpenseListItemProps {
    expense: ExpenseWithAccount;
    onPress?: () => void;
}

export const ExpenseListItem: React.FC<ExpenseListItemProps> = ({
    expense,
    onPress
}) => {
    const { colors } = useTheme();
    const category = getCategoryById(expense.category);

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.surface }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
                <Ionicons
                    name={category.icon as any}
                    size={22}
                    color={category.color}
                />
            </View>

            <View style={styles.details}>
                <Text style={[styles.categoryName, { color: colors.text }]}>
                    {category.name}
                </Text>
                <View style={styles.subDetails}>
                    <Text style={[styles.accountName, { color: colors.textMuted }]}>
                        {expense.account_name}
                    </Text>
                    {expense.description && (
                        <>
                            <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
                            <Text
                                style={[styles.description, { color: colors.textMuted }]}
                                numberOfLines={1}
                            >
                                {expense.description}
                            </Text>
                        </>
                    )}
                </View>
            </View>

            <View style={styles.rightSection}>
                <Text style={[styles.amount, { color: colors.text }]}>
                    {formatCurrency(expense.amount)}
                </Text>
                <Text style={[styles.date, { color: colors.textMuted }]}>
                    {getRelativeDay(expense.date)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginVertical: 4,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    details: {
        flex: 1,
        marginLeft: 12,
    },
    categoryName: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    subDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accountName: {
        fontSize: 12,
    },
    dot: {
        marginHorizontal: 6,
        fontSize: 8,
    },
    description: {
        fontSize: 12,
        flex: 1,
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 2,
    },
    date: {
        fontSize: 11,
    },
});
