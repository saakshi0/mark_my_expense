import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
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
    const { colors } = useTheme();

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <TouchableOpacity
                style={[
                    styles.chip,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    selectedCategory === null && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => onSelect(null)}
            >
                <Text style={[
                    styles.chipText,
                    { color: colors.text },
                    selectedCategory === null && { color: '#FFFFFF' }
                ]}>
                    All
                </Text>
            </TouchableOpacity>

            {CATEGORIES.map((cat) => (
                <TouchableOpacity
                    key={cat.id}
                    style={[
                        styles.chip,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                        selectedCategory === cat.id && { backgroundColor: cat.color + '20', borderColor: cat.color }
                    ]}
                    onPress={() => onSelect(cat.id)}
                >
                    <View style={[styles.dot, { backgroundColor: cat.color }]} />
                    <Text style={[
                        styles.chipText,
                        { color: colors.text },
                        selectedCategory === cat.id && { color: cat.color, fontWeight: '600' }
                    ]}>
                        {cat.name.split(' ')[0]}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    chipText: {
        fontSize: 13,
        fontWeight: '500',
    },
});
