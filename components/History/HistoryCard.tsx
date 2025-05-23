import { Text, View } from '@/components/Themed';
import { History } from '@/utils/types';
import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface HistoryCardProps {
    history: History;
    open: (history: any) => void;
}

export default function HistoryCard({ history, open }: HistoryCardProps) {

    function convertTime(timeMin: string) {
        let newTime;
        if (parseInt(timeMin, 10) > 60) {
            newTime = "" + (Math.floor(parseInt(timeMin, 10) / 60)) + "hr" + (parseInt(timeMin, 10) % 60) + "min";
        } else {
            newTime = "" + timeMin + "min";
        }
        return newTime;
    }

    return (
        <View>
            <TouchableOpacity
                onPress={() => open(history)}
            >
                <View style={styles.historyModal}>
                    <Text>{history.date}</Text>
                    <Text style={{ fontWeight: '500' }}> {history.routine.title}</Text>
                    <Text> {convertTime(history.lengthMin)}</Text>
                    <Text> {history.totalWeight}lbs</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    historyModal: {
        width: '100%',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        paddingVertical: 10
    }
});
