import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Switch,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { notificationService } from '../services/notificationService';
import { clearAllData } from '../database/database';

export const SettingsScreen: React.FC = () => {
    const { colors } = useTheme();
    const [dailyReminder, setDailyReminder] = useState(true);
    const [weeklySummary, setWeeklySummary] = useState(true);
    const [notificationCount, setNotificationCount] = useState(0);

    // Erase data state
    const [showEraseModal, setShowEraseModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isErasing, setIsErasing] = useState(false);

    const loadNotificationStatus = useCallback(async () => {
        try {
            const scheduled = await notificationService.getScheduledNotifications();
            setNotificationCount(scheduled.length);

            // Check which notifications are scheduled
            const hasDailyReminder = scheduled.some(n => n.identifier === 'daily-expense-reminder');
            const hasWeeklySummary = scheduled.some(n => n.identifier === 'weekly-expense-summary');

            setDailyReminder(hasDailyReminder);
            setWeeklySummary(hasWeeklySummary);
        } catch (error) {
            console.error('Failed to load notification status:', error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadNotificationStatus();
        }, [loadNotificationStatus])
    );

    const handleDailyReminderToggle = async (value: boolean) => {
        setDailyReminder(value);
        if (value) {
            await notificationService.scheduleDailyReminder();
        } else {
            await notificationService.cancelNotification('daily-expense-reminder');
        }
        loadNotificationStatus();
    };

    const handleWeeklySummaryToggle = async (value: boolean) => {
        setWeeklySummary(value);
        if (value) {
            await notificationService.scheduleWeeklySummary();
        } else {
            await notificationService.cancelNotification('weekly-expense-summary');
        }
        loadNotificationStatus();
    };

    const handleTestNotification = async () => {
        try {
            await notificationService.sendTestNotification();
            Alert.alert('Success', 'Test notification sent! Check your notification tray.');
        } catch (error) {
            Alert.alert('Error', 'Failed to send test notification. Please check app permissions.');
        }
    };

    const handleSendWeeklySummary = async () => {
        try {
            await notificationService.sendWeeklySummaryWithData();
            Alert.alert('Success', 'Weekly summary notification sent!');
        } catch (error) {
            Alert.alert('Error', 'Failed to send weekly summary.');
        }
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
            Alert.alert('Success', 'All data has been erased successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to erase data');
        } finally {
            setIsErasing(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
                <ThemeToggle />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Notifications Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Notifications
                    </Text>

                    <View style={[styles.card, { backgroundColor: colors.surface }]}>
                        {/* Daily Reminder */}
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
                                    <Ionicons name="notifications" size={20} color={colors.primary} />
                                </View>
                                <View style={styles.settingText}>
                                    <Text style={[styles.settingLabel, { color: colors.text }]}>
                                        Daily Reminder
                                    </Text>
                                    <Text style={[styles.settingDescription, { color: colors.textMuted }]}>
                                        Remind at 9 PM to log expenses
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={dailyReminder}
                                onValueChange={handleDailyReminderToggle}
                                trackColor={{ false: colors.border, true: colors.primary + '50' }}
                                thumbColor={dailyReminder ? colors.primary : colors.textMuted}
                            />
                        </View>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        {/* Weekly Summary */}
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <View style={[styles.iconBox, { backgroundColor: colors.success + '20' }]}>
                                    <Ionicons name="stats-chart" size={20} color={colors.success} />
                                </View>
                                <View style={styles.settingText}>
                                    <Text style={[styles.settingLabel, { color: colors.text }]}>
                                        Weekly Summary
                                    </Text>
                                    <Text style={[styles.settingDescription, { color: colors.textMuted }]}>
                                        Sunday 9 PM spending summary
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={weeklySummary}
                                onValueChange={handleWeeklySummaryToggle}
                                trackColor={{ false: colors.border, true: colors.success + '50' }}
                                thumbColor={weeklySummary ? colors.success : colors.textMuted}
                            />
                        </View>
                    </View>

                    {/* Notification Status */}
                    <View style={[styles.statusBanner, { backgroundColor: colors.primary + '10' }]}>
                        <Ionicons name="information-circle" size={18} color={colors.primary} />
                        <Text style={[styles.statusText, { color: colors.primary }]}>
                            {notificationCount} notification{notificationCount !== 1 ? 's' : ''} scheduled
                        </Text>
                    </View>
                </View>

                {/* Test Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Test Notifications
                    </Text>

                    <View style={[styles.card, { backgroundColor: colors.surface }]}>
                        <TouchableOpacity
                            style={styles.actionRow}
                            onPress={handleTestNotification}
                        >
                            <View style={styles.settingInfo}>
                                <View style={[styles.iconBox, { backgroundColor: '#F59E0B20' }]}>
                                    <Ionicons name="paper-plane" size={20} color="#F59E0B" />
                                </View>
                                <View style={styles.settingText}>
                                    <Text style={[styles.settingLabel, { color: colors.text }]}>
                                        Send Test Notification
                                    </Text>
                                    <Text style={[styles.settingDescription, { color: colors.textMuted }]}>
                                        Verify notifications are working
                                    </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                        </TouchableOpacity>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <TouchableOpacity
                            style={styles.actionRow}
                            onPress={handleSendWeeklySummary}
                        >
                            <View style={styles.settingInfo}>
                                <View style={[styles.iconBox, { backgroundColor: '#8B5CF620' }]}>
                                    <Ionicons name="bar-chart" size={20} color="#8B5CF6" />
                                </View>
                                <View style={styles.settingText}>
                                    <Text style={[styles.settingLabel, { color: colors.text }]}>
                                        Preview Weekly Summary
                                    </Text>
                                    <Text style={[styles.settingDescription, { color: colors.textMuted }]}>
                                        See your weekly spending now
                                    </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Danger Zone */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.error }]}>
                        Danger Zone
                    </Text>

                    <View style={[styles.dangerCard, { backgroundColor: colors.surface, borderColor: colors.error + '30' }]}>
                        <View style={styles.dangerContent}>
                            <View style={[styles.iconBox, { backgroundColor: colors.error + '20' }]}>
                                <Ionicons name="warning" size={20} color={colors.error} />
                            </View>
                            <View style={styles.settingText}>
                                <Text style={[styles.settingLabel, { color: colors.text }]}>
                                    Erase All Data
                                </Text>
                                <Text style={[styles.settingDescription, { color: colors.textMuted }]}>
                                    Permanently delete all accounts & expenses
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[styles.eraseButton, { backgroundColor: colors.error + '15', borderColor: colors.error }]}
                            onPress={() => setShowEraseModal(true)}
                        >
                            <Ionicons name="trash" size={16} color={colors.error} />
                            <Text style={[styles.eraseButtonText, { color: colors.error }]}>Erase</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Privacy & Data Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Privacy & Data
                    </Text>

                    <View style={[styles.card, { backgroundColor: colors.surface }]}>
                        <View style={styles.privacyRow}>
                            <View style={[styles.iconBox, { backgroundColor: colors.success + '20' }]}>
                                <Ionicons name="shield-checkmark" size={20} color={colors.success} />
                            </View>
                            <View style={styles.settingText}>
                                <Text style={[styles.settingLabel, { color: colors.text }]}>
                                    Your Data Stays Private
                                </Text>
                                <Text style={[styles.settingDescription, { color: colors.textMuted }]}>
                                    All your data is stored locally on your device only. No data is sent to any server.
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <View style={styles.privacyRow}>
                            <View style={[styles.iconBox, { backgroundColor: colors.warning + '20' }]}>
                                <Ionicons name="phone-portrait-outline" size={20} color={colors.warning} />
                            </View>
                            <View style={styles.settingText}>
                                <Text style={[styles.settingLabel, { color: colors.text }]}>
                                    Device-Only Storage
                                </Text>
                                <Text style={[styles.settingDescription, { color: colors.textMuted }]}>
                                    If you uninstall this app, all your data will be permanently deleted from your device.
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <View style={styles.privacyRow}>
                            <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
                                <Ionicons name="download-outline" size={20} color={colors.primary} />
                            </View>
                            <View style={styles.settingText}>
                                <Text style={[styles.settingLabel, { color: colors.text }]}>
                                    Export Your Data
                                </Text>
                                <Text style={[styles.settingDescription, { color: colors.textMuted }]}>
                                    Use the CSV export feature in the Accounts screen to backup your data regularly.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* App Info */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        About
                    </Text>

                    <View style={[styles.card, { backgroundColor: colors.surface }]}>
                        <View style={styles.infoRow}>
                            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Version</Text>
                            <Text style={[styles.infoValue, { color: colors.text }]}>1.0.0</Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <View style={styles.infoRow}>
                            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>App Name</Text>
                            <Text style={[styles.infoValue, { color: colors.text }]}>Mark My Expense</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>

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
                            </View>

                            <View style={[styles.backupWarningBox, { backgroundColor: colors.warning + '15', borderColor: colors.warning + '40' }]}>
                                <Ionicons name="cloud-offline-outline" size={20} color={colors.warning} />
                                <Text style={[styles.backupWarningText, { color: colors.warning }]}>
                                    Data cannot be restored if you haven't taken a backup using CSV export.
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
    content: {
        flex: 1,
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    dangerCard: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dangerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    settingText: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 12,
    },
    divider: {
        height: 1,
        marginHorizontal: 16,
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        marginTop: 12,
        gap: 8,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '500',
    },
    eraseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        borderWidth: 1,
        gap: 6,
    },
    eraseButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    infoLabel: {
        fontSize: 14,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    bottomPadding: {
        height: 120,
    },
    privacyRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
    },
    backupWarningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 8,
        gap: 10,
    },
    backupWarningText: {
        fontSize: 13,
        fontWeight: '500',
        flex: 1,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
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
        fontSize: 18,
        fontWeight: '700',
    },
    modalBody: {
        padding: 20,
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
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
        marginBottom: 20,
    },
    deleteItem: {
        fontSize: 14,
        marginBottom: 6,
        marginLeft: 8,
    },
    inputSection: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    textInput: {
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 2,
        textAlign: 'center',
    },
    cancelButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    eraseConfirmButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    eraseConfirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
