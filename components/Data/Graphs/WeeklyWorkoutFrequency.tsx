import { Text, View } from '@/components/Themed';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Circle, useFont } from '@shopify/react-native-skia';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import type { SharedValue } from "react-native-reanimated";
import { Bar, CartesianChart, useChartPressState } from 'victory-native';

interface WorkoutFrequencyChartProps {
    data: { workout_date: string; session_count: number }[];
}

export default function WorkoutFrequencyChart({ data } : WorkoutFrequencyChartProps) {
    const SpaceMono = require('../../../assets/fonts/SpaceMono-Regular.ttf');

    const font = useFont(SpaceMono, 16);

    const text = useThemeColor({}, 'text');

    const { state, isActive } = useChartPressState<{ x: string; y: { session_count: number } }>({ x: "", y: { session_count: 0 } });

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBar, setSelectedBar] = useState<{ workout_date: string; session_count: number } | null>(null);

    // useEffect(() => {
    //     if (isActive) {
    //         setModalVisible(true);
    //     }
    // }, [isActive, state.x, data]);

    function ToolTip({ x, y }: { x: SharedValue<number>; y: any }) {
        return <Circle cx={x} cy={y.session_count.position} r={6} color={text}/>;
    }

    return (
        <View style={{ height: 200, padding: 4, backgroundColor: 'transparent' }}>
            <CartesianChart
                data={data}
                xKey={'workout_date'} 
                yKeys={["session_count"]}
                domainPadding={{ left: 20, right: 20, top: 20 }}
                axisOptions={{
                    font,
                    lineColor: text,
                    labelColor: text,
                    formatXLabel: (value) => {
                        // Convert YYYY-MM-DD to day of week
                        const date = new Date(value);
                        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                        const day = days[date.getDay()];
                        if (day === "Thu") return "Th";
                        if (day === "Sun") return "Su";
                        return day.charAt(0);
                    },
                    formatYLabel: (value) => {
                        // Only display the value if it doesn't end in 0.5
                        if (value % 1 === 0) {
                        return value.toString();
                        }
                        return "";
                    }
                }} 
                chartPressState={state}
            >
                {({ points, chartBounds }) => (
                    <>
                        <Bar
                            color="#ff8787"
                            points={points.session_count} 
                            chartBounds={chartBounds}  
                            roundedCorners={{
                                topLeft: 5,
                                topRight: 5,
                            }}
                        />
                        {
                            isActive && (
                                <ToolTip x={state.x.position} y={state.y} />
                            )
                        }
                    </>
                )}
            </CartesianChart>
            <Modal
                visible={modalVisible} 
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Workout Details</Text>
                        <Text>Date: {selectedBar?.workout_date}</Text>
                        <Text>Sessions: {selectedBar?.session_count}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>            
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        minWidth: 220,
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 12,
    },
    closeButton: {
        marginTop: 16,
        backgroundColor: '#ff8787',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});