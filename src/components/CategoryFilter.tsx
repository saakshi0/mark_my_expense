import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { CATEGORIES } from '../constants/categories';

interface CategoryFilterProps {
    selectedCategory: string | null;
    onSelect: (categoryId: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    selectedCategory,
    onSelect,
}) => {
    const [visible, setVisible] = useState(false);
    const { colors } = useTheme();

    const selectedCat = CATEGORIES.find(c => c.id === selectedCategory);

    const handleSelect = (categoryId: string | null) => {
        onSelect(categoryId);
        setVisible(false);
    };

    return (
        <>
            <TouchableOpacity
                style={[styles.selector, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
                onPress={() => setVisible(true)}
            >
                <View style={styles.selectorContent}>
                    {selectedCat ? (
                        <>
                            <View style={[styles.colorDot, { backgroundColor: selectedCat.color }]} />
                            <Ionicons
                                name={selectedCat.icon as any}
                                size={18}
                                color={selectedCat.color}
                                style={styles.categoryIcon}
                            />
                            <Text style={[styles.selectorText, { color: colors.text }]}>
                                {selectedCat.name}
                            </Text>
                        </>
                    ) : (
                        <>
                            <Ionicons
                                name="apps"
                                size={18}
                                color={colors.primary}
                                style={styles.categoryIcon}
                            />
                            <Text style={[styles.selectorText, { color: colors.text }]}>
                                All Categories
                            </Text>
                        </>
                    )}
                </View>
                <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <Modal
                visible={visible}
                transparent
                animationType="slide"
                onRequestClose={() => setVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <SafeAreaView style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                Select Category
                            </Text>
                            <TouchableOpacity onPress={() => setVisible(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={[{ id: null, name: 'All Categories', icon: 'apps', color: colors.primary }, ...CATEGORIES]}
                            keyExtractor={(item) => item.id || 'all'}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.categoryItem,
                                        { backgroundColor: colors.surface },
                                        selectedCategory === item.id && { borderColor: item.color, borderWidth: 2 }
                                    ]}
                                    onPress={() => handleSelect(item.id)}
                                >
                                    <View style={[styles.categoryIconBox, { backgroundColor: item.color + '20' }]}>
                                        <Ionicons
                                            name={item.icon as any}
                                            size={22}
                                            color={item.color}
                                        />
                                    </View>
                                    <Text style={[styles.categoryName, { color: colors.text }]}>
                                        {item.name}
                                    </Text>
                                    {selectedCategory === item.id && (
                                        <Ionicons name="checkmark-circle" size={24} color={item.color} />
                                    )}
                                </TouchableOpacity>
                            )}
                            contentContainerStyle={styles.listContent}
                        />
                    </SafeAreaView>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 12,
        borderWidth: 1,
    },
    selectorContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    categoryIcon: {
        marginRight: 10,
    },
    selectorText: {
        fontSize: 15,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        marginBottom: 8,
    },
    categoryIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    categoryName: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
    },
});
