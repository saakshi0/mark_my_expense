import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { CategoryPicker } from './CategoryPicker';
import { AccountPicker } from './AccountPicker';
import { Account } from '../types';
import { formatDate } from '../utils/dateUtils';

interface AddExpenseModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: {
        amount: number;
        category: string;
        account_id: number;
        date: Date;
        description: string;
    }) => Promise<void>;
    accounts: Account[];
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
    visible,
    onClose,
    onSubmit,
    accounts,
}) => {
    const { colors } = useTheme();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('food');
    const [accountId, setAccountId] = useState<number | null>(null);
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Reset form when modal opens
    useEffect(() => {
        if (visible) {
            setAmount('');
            setCategory('food');
            setAccountId(accounts.length > 0 ? accounts[0].id : null);
            setDate(new Date());
            setDescription('');
        }
    }, [visible, accounts]);

    const handleSubmit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }
        if (!accountId) {
            Alert.alert('Error', 'Please select an account');
            return;
        }

        setLoading(true);
        try {
            await onSubmit({
                amount: parseFloat(amount),
                category,
                account_id: accountId,
                date,
                description: description.trim(),
            });
            onClose();
        } catch (error) {
            Alert.alert('Error', 'Failed to add expense');
        } finally {
            setLoading(false);
        }
    };

    const adjustDate = (days: number) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        if (newDate <= new Date()) {
            setDate(newDate);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>
                            Add Expense
                        </Text>
                        <View style={styles.headerRight} />
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Amount Input */}
                        <View style={styles.amountContainer}>
                            <Text style={[styles.currencySymbol, { color: colors.primary }]}>₹</Text>
                            <TextInput
                                style={[styles.amountInput, { color: colors.text }]}
                                value={amount}
                                onChangeText={setAmount}
                                placeholder="0"
                                placeholderTextColor={colors.textMuted}
                                keyboardType="decimal-pad"
                                autoFocus
                            />
                        </View>

                        {/* Form Fields */}
                        <View style={styles.formSection}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
                            <CategoryPicker
                                selectedCategory={category}
                                onSelect={setCategory}
                            />
                        </View>

                        <View style={styles.formSection}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Account</Text>
                            <AccountPicker
                                accounts={accounts}
                                selectedAccountId={accountId}
                                onSelect={setAccountId}
                            />
                        </View>

                        <View style={styles.formSection}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Date</Text>
                            <View style={[styles.dateContainer, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
                                <TouchableOpacity
                                    style={styles.dateArrow}
                                    onPress={() => adjustDate(-1)}
                                >
                                    <Ionicons name="chevron-back" size={24} color={colors.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.dateDisplay}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                                    <Text style={[styles.dateText, { color: colors.text }]}>
                                        {formatDate(date)}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.dateArrow}
                                    onPress={() => adjustDate(1)}
                                    disabled={date.toDateString() === new Date().toDateString()}
                                >
                                    <Ionicons
                                        name="chevron-forward"
                                        size={24}
                                        color={date.toDateString() === new Date().toDateString() ? colors.textMuted : colors.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.formSection}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>
                                Description (optional)
                            </Text>
                            <TextInput
                                style={[styles.descriptionInput, {
                                    backgroundColor: colors.surfaceVariant,
                                    borderColor: colors.border,
                                    color: colors.text
                                }]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Add a note..."
                                placeholderTextColor={colors.textMuted}
                                multiline
                                numberOfLines={2}
                            />
                        </View>
                    </ScrollView>

                    {/* Submit Button */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.submitButton, { backgroundColor: colors.primary }]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <Ionicons name="add-circle" size={22} color="#FFFFFF" />
                            <Text style={styles.submitButtonText}>
                                {loading ? 'Adding...' : 'Add Expense'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    closeButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    headerRight: {
        width: 32,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 24,
    },
    currencySymbol: {
        fontSize: 40,
        fontWeight: '300',
        marginRight: 8,
    },
    amountInput: {
        fontSize: 56,
        fontWeight: '700',
        minWidth: 100,
        textAlign: 'center',
    },
    formSection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    dateArrow: {
        padding: 12,
    },
    dateDisplay: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
    },
    dateText: {
        fontSize: 15,
        fontWeight: '500',
    },
    descriptionInput: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 14,
        fontSize: 15,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    footer: {
        padding: 20,
        paddingBottom: 32,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 14,
        gap: 8,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
