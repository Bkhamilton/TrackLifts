import { History } from '@/utils/types';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../Themed';
import HistoryCard from './HistoryCard';

interface HistoryInfoProps {
    open: (routine: any) => void;
    data: History[];
}

export default function HistoryInfo({ open, data }: HistoryInfoProps) {
    return (
        <View style={styles.container}>
            <View>
                <Text style={{ fontSize: 14, fontWeight: '800' }}>March 2022</Text>
            </View>
            <View style={{ paddingTop: 10 }}>
                {
                    data.map(type => (
                        <View style={{ paddingVertical: 2 }} key={type.id}>
                            <HistoryCard 
                                history={type} 
                                open={open} 
                            />
                        </View>
                    ))
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 350,
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});