import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { AccountCard } from '../components/AccountCard';
import { accountRepository } from '../database/repositories/accountRepository';
import { clearAllData } from '../database/database';
import { AccountSummary } from '../types';
import { formatCurrency } from '../utils/dateUtils';

export const AccountsScreen: React.FC = () => {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [accounts, setAccounts] = useState<AccountSummary[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEraseModal, setShowEraseModal] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const [accountType, setAccountType] = useState<'bank' | 'card'>('bank');
    const [totalMonthlySpend, setTotalMonthlySpend] = useState(0);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isErasing, setIsErasing] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const accountsWithSpend = await accountRepository.getWithMonthlySpend();
            setAccounts(accountsWithSpend);
            const total = accountsWithSpend.reduce((sum, acc) => sum + acc.total, 0);
            setTotalMonthlySpend(total);
        } catch (error) {
            console.error('Failed to load accounts:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const handleAddAccount = async () => {
        if (!newAccountName.trim()) {
            Alert.alert('Error', 'Please enter an account name');
            return;
        }

        try {
            await accountRepository.create(newAccountName.trim(), accountType);
            setNewAccountName('');
            setAccountType('bank');
            setShowAddModal(false);
            loadData();
        } catch (error) {
            Alert.alert('Error', 'Failed to add account');
        }
    };

    const handleDeleteAccount = (accountId: number, accountName: string) => {
        Alert.alert(
            'Delete Account',
            `Are you sure you want to delete "${accountName}"? All expenses linked to this account will also be deleted.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await accountRepository.delete(accountId);
                            loadData();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete account');
                        }
                    },
                },
            ]
        );
    };

    const handleEraseAllData = async () => {
        if (deleteConfirmText !== 'DELETE') {
            Alert.alert('Error', 'Please type DELETE to confirm');
            return;
        }

        setIsErasing(true);
        try {
            await clearAllData();
            setDeleteConfirmText('');
            setShowEraseModal(false);
            loadData();
            Alert.alert('Success', 'All data has been erased successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to erase data');
        } finally {
            setIsErasing(false);
        }
    };

    const renderHeader = () => (
        <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
            <View style={styles.summaryContent}>
                <Text style={styles.summaryLabel}>Total Monthly Spend</Text>
                <Text style={styles.summaryAmount}>{formatCurrency(totalMonthlySpend)}</Text>
                <Text style={styles.summarySubtext}>
                    Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
                </Text>
            </View>
            <View style={styles.summaryIconContainer}>
                <Ionicons name="wallet" size={48} color="rgba(255,255,255,0.3)" />
            </View>
        </View>
    );

    const renderFooter = () => (
        <View style={styles.footerSection}>
            <View style={[styles.dangerZone, { backgroundColor: colors.surface, borderColor: colors.error + '30' }]}>
                <Text style={[styles.dangerTitle, { color: colors.error }]}>Danger Zone</Text>
                <Text style={[styles.dangerDescription, { color: colors.textMuted }]}>
                    Permanently delete all your data including accounts and expenses.
                </Text>
                <TouchableOpacity
                    style={[styles.eraseButton, { backgroundColor: colors.error + '15', borderColor: colors.error }]}
                    onPress={() => setShowEraseModal(true)}
                >
                    <Ionicons name="trash" size={18} color={colors.error} />
                    <Text style={[styles.eraseButtonText, { color: colors.error }]}>Erase All Data</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={64} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No accounts yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
                Add your first bank account or card
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Accounts</Text>
                <View style={styles.headerRight}>
                    <ThemeToggle />
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: colors.primary }]}
                        onPress={() => setShowAddModal(true)}
                    >
                        <Ionicons name="add" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={accounts}
                keyExtractor={(item) => item.account_id.toString()}
                renderItem={({ item }) => (
                    <AccountCard
                        account={item}
                        onDelete={() => handleDeleteAccount(item.account_id, item.account_name)}
                    />
                )}
                ListHeaderComponent={accounts.length > 0 ? renderHeader : null}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                contentContainerStyle={[styles.listContent, { paddingBottom: 120 }]}
                showsVerticalScrollIndicator={false}
            />

            {/* Add Account Modal */}
            <Modal
                visible={showAddModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowAddModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <SafeAreaView style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                Add Account
                            </Text>
                            <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            {/* Account Name */}
                            <View style={styles.inputSection}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                                    Account Name
                                </Text>
                                <TextInput
                                    style={[styles.textInput, {
                                        backgroundColor: colors.surfaceVariant,
                                        borderColor: colors.border,
                                        color: colors.text
                                    }]}
                                    value={newAccountName}
                                    onChangeText={setNewAccountName}
                                    placeholder="e.g., HDFC Savings, ICICI Credit Card"
                                    placeholderTextColor={colors.textMuted}
                                    autoFocus
                                />
                            </View>

                            {/* Account Type */}
                            <View style={styles.inputSection}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                                    Account Type
                                </Text>
                                <View style={styles.typeSelector}>
                                    <TouchableOpacity
                                        style={[
                                            styles.typeButton,
                                            { backgroundColor: colors.surface, borderColor: colors.border },
                                            accountType === 'bank' && { backgroundColor: colors.primary + '15', borderColor: colors.primary }
                                        ]}
                                        onPress={() => setAccountType('bank')}
                                    >
                                        <Ionicons
                                            name="business"
                                            size={24}
                                            color={accountType === 'bank' ? colors.primary : colors.textMuted}
                                        />
                                        <Text style={[
                                            styles.typeText,
                                            { color: colors.text },
                                            accountType === 'bank' && { color: colors.primary, fontWeight: '600' }
                                        ]}>
                                            Bank
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.typeButton,
                                            { backgroundColor: colors.surface, borderColor: colors.border },
                                            accountType === 'card' && { backgroundColor: colors.primary + '15', borderColor: colors.primary }
                                        ]}
                                        onPress={() => setAccountType('card')}
                                    >
                                        <Ionicons
                                            name="card"
                                            size={24}
                                            color={accountType === 'card' ? colors.primary : colors.textMuted}
                                        />
                                        <Text style={[
                                            styles.typeText,
                                            { color: colors.text },
                                            accountType === 'card' && { color: colors.primary, fontWeight: '600' }
                                        ]}>
                                            Card
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.submitButton, { backgroundColor: colors.primary }]}
                                onPress={handleAddAccount}
                            >
                                <Ionicons name="add-circle" size={22} color="#FFFFFF" />
                                <Text style={styles.submitButtonText}>Add Account</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>

            {/* Erase Data Modal */}
            <Modal
                visible={showEraseModal}
                transparent
                animationType="slide"
                onRequestClose={() => {
                    setShowEraseModal(false);
                    setDeleteConfirmText('');
                }}
            >
                <View style={styles.modalOverlay}>
                    <SafeAreaView style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.error }]}>
                                ⚠️ Erase All Data
                            </Text>
                            <TouchableOpacity onPress={() => {
                                setShowEraseModal(false);
                                setDeleteConfirmText('');
                            }}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <View style={[styles.warningBox, { backgroundColor: colors.error + '10' }]}>
                                <Ionicons name="warning" size={32} color={colors.error} />
                                <Text style={[styles.warningText, { color: colors.error }]}>
                                    This action cannot be undone!
                                </Text>
                            </View>

                            <Text style={[styles.eraseDescription, { color: colors.text }]}>
                                This will permanently delete:
                            </Text>
                            <View style={styles.deleteList}>
                                <Text style={[styles.deleteItem, { color: colors.textSecondary }]}>
                                    • All your accounts
                                </Text>
                                <Text style={[styles.deleteItem, { color: colors.textSecondary }]}>
                                    • All your expense records
                                </Text>
                                <Text style={[styles.deleteItem, { color: colors.textSecondary }]}>
                                    • All category summaries
                                </Text>
                            </View>

                            <View style={styles.inputSection}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                                    Type DELETE to confirm
                                </Text>
                                <TextInput
                                    style={[styles.textInput, {
                                        backgroundColor: colors.surfaceVariant,
                                        borderColor: deleteConfirmText === 'DELETE' ? colors.error : colors.border,
                                        color: colors.text,
                                        textAlign: 'center',
                                        fontSize: 18,
                                        fontWeight: '600',
                                        letterSpacing: 2,
                                    }]}
                                    value={deleteConfirmText}
                                    onChangeText={setDeleteConfirmText}
                                    placeholder="DELETE"
                                    placeholderTextColor={colors.textMuted}
                                    autoCapitalize="characters"
                                    autoCorrect={false}
                                />
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.cancelButton, { borderColor: colors.border }]}
                                onPress={() => {
                                    setShowEraseModal(false);
                                    setDeleteConfirmText('');
                                }}
                            >
                                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.eraseConfirmButton,
                                    { backgroundColor: deleteConfirmText === 'DELETE' ? colors.error : colors.textMuted }
                                ]}
                                onPress={handleEraseAllData}
                                disabled={deleteConfirmText !== 'DELETE' || isErasing}
                            >
                                {isErasing ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <>
                                        <Ionicons name="trash" size={18} color="#FFFFFF" />
                                        <Text style={styles.eraseConfirmButtonText}>Erase All</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>
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
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryCard: {
        flexDirection: 'row',
        margin: 16,
        padding: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },
    summaryContent: {
        flex: 1,
    },
    summaryLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '500',
    },
    summaryAmount: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '700',
        marginVertical: 8,
    },
    summarySubtext: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
    },
    summaryIconContainer: {
        justifyContent: 'center',
    },
    listContent: {
        paddingBottom: 30,
        flexGrow: 1,
    },
    footerSection: {
        marginTop: 32,
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    dangerZone: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
    },
    dangerTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    dangerDescription: {
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 16,
    },
    eraseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        gap: 8,
    },
    eraseButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    modalBody: {
        padding: 20,
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        gap: 12,
    },
    warningText: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    eraseDescription: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 12,
    },
    deleteList: {
        marginBottom: 24,
    },
    deleteItem: {
        fontSize: 14,
        marginBottom: 6,
    },
    inputSection: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    textInput: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 14,
        fontSize: 16,
    },
    typeSelector: {
        flexDirection: 'row',
        gap: 12,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        gap: 10,
    },
    typeText: {
        fontSize: 15,
        fontWeight: '500',
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        paddingBottom: 32,
        gap: 12,
    },
    submitButton: {
        flex: 1,
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
    cancelButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    eraseConfirmButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 14,
        gap: 8,
    },
    eraseConfirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
