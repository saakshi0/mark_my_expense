import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { MonthlySpendWidget } from './MonthlySpendWidget';
import { getCachedMonthlyTotal } from '../utils/widgetStorage';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
    const Widget = props.renderWidget;

    switch (props.widgetAction) {
        case 'WIDGET_ADDED':
        case 'WIDGET_UPDATE':
        case 'WIDGET_RESIZED':
            const monthlyTotal = getCachedMonthlyTotal();
            Widget(
                <MonthlySpendWidget monthlyTotal={monthlyTotal} />
            );
            break;

        case 'WIDGET_DELETED':
            // Cleanup if needed
            break;

        case 'WIDGET_CLICK':
            // Handle click - opens the app by default via clickAction="OPEN_APP"
            break;

        default:
            break;
    }
}
