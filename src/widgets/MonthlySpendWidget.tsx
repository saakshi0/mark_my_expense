import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface MonthlySpendWidgetProps {
    monthlyTotal: string;
}

export function MonthlySpendWidget({ monthlyTotal }: MonthlySpendWidgetProps) {
    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#1a1a2e',
                borderRadius: 24,
                padding: 16,
            }}
            clickAction="OPEN_APP"
        >
            {/* Spend Info */}
            <FlexWidget
                style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                }}
            >
                <TextWidget
                    text={monthlyTotal}
                    style={{
                        fontSize: 28,
                        fontWeight: '700',
                        color: '#ffffff',
                    }}
                />
                <TextWidget
                    text="Spent this month"
                    style={{
                        fontSize: 12,
                        color: '#94A3B8',
                        marginTop: 4,
                    }}
                />
            </FlexWidget>

            {/* Add Button */}
            <FlexWidget
                style={{
                    width: 44,
                    height: 44,
                    backgroundColor: '#6366F1',
                    borderRadius: 22,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                clickAction="OPEN_URI"
                clickActionData={{
                    uri: 'markmyexpense://app/add-expense',
                }}
            >
                <TextWidget
                    text="+"
                    style={{
                        fontSize: 24,
                        fontWeight: '700',
                        color: '#ffffff',
                    }}
                />
            </FlexWidget>
        </FlexWidget>
    );
}
