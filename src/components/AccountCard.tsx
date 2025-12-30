import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { AccountSummary } from '../types';
import { formatCurrency } from '../utils/dateUtils';
import { getBankIcon } from '../utils/bankIcons';

interface AccountCardProps {
    account: AccountSummary;
    onDelete?: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
    account,
    onDelete
}) => {
    const { colors } = useTheme();
    const bankIcon = getBankIcon(account.account_name);

    return (
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
            <View style={[styles.iconContainer, { backgroundColor: 'transparent' }]}>
                <Image
                    source={bankIcon}
                    style={styles.bankLogo}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.details}>
                <Text style={[styles.name, { color: colors.text }]}>
                    {account.account_name}
                </Text>
                <Text style={[styles.spendLabel, { color: colors.textMuted }]}>
                    This month
                </Text>
            </View>

            <View style={styles.rightSection}>
                <Text style={[styles.amount, { color: colors.primary }]}>
                    {formatCurrency(account.total)}
                </Text>
                {onDelete && (
                    <TouchableOpacity
                        onPress={onDelete}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name="trash-outline"
                            size={18}
                            color={colors.error}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginVertical: 6,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    iconContainer: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bankLogo: {
        width: 40,
        height: 40,
    },
    details: {
        flex: 1,
        marginLeft: 14,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    spendLabel: {
        fontSize: 12,
    },
    rightSection: {
        alignItems: 'flex-end',
        gap: 8,
    },
    amount: {
        fontSize: 17,
        fontWeight: '700',
    },
});
